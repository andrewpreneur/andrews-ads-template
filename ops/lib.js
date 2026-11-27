// Shared helpers for meta-ads-cli scripts (Node 18+, no deps)
const fs = require("fs");
const path = require("path");

const API_VERSION = "v21.0";

function loadEnv() {
  // Local runs read ops/.env; the cloud environment provides the same names as env vars.
  const envPath = path.join(__dirname, ".env");
  const env = {};
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/);
      if (m) env[m[1]] = m[2];
    }
  }
  for (const k of ["ACCESS_TOKEN", "AD_ACCOUNT_ID", "PAGE_ID", "IG_USER_ID", "PIXEL_ID"]) {
    if (!env[k] && process.env[k]) env[k] = process.env[k];
  }
  if (env.ACCESS_TOKEN) env.ACCESS_TOKEN = env.ACCESS_TOKEN.replace(/^<|>$/g, "");
  if (env.AD_ACCOUNT_ID) env.AD_ACCOUNT_ID = env.AD_ACCOUNT_ID.replace(/^act_/, "");
  if (!env.ACCESS_TOKEN || !env.AD_ACCOUNT_ID) {
    console.error("Missing ACCESS_TOKEN or AD_ACCOUNT_ID (set them in ops/.env or the environment)");
    process.exit(1);
  }
  return env;
}

async function graph(pathname, params = {}, { method = "GET", token } = {}) {
  const url = new URL(`https://graph.facebook.com/${API_VERSION}/${pathname}`);
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const val = typeof v === "object" ? JSON.stringify(v) : String(v);
    if (method === "GET") url.searchParams.set(k, val);
    else body.set(k, val);
  }
  if (method === "GET") url.searchParams.set("access_token", token);
  else body.set("access_token", token);

  const res = await fetch(url, method === "GET" ? {} : { method, body });
  const json = await res.json();
  if (json.error) {
    const e = json.error;
    if (e.code === 190) {
      console.error("\n✖ Access token expired or invalid.");
      console.error("  Get a fresh one: https://developers.facebook.com/tools/explorer/");
      console.error("  Permissions needed: ads_read (dashboard) + ads_management (launching)");
      console.error("  Then paste it into .env as ACCESS_TOKEN=...\n");
    }
    const detail = e.error_user_msg ? ` — ${e.error_user_title}: ${e.error_user_msg}` : "";
    throw new Error(`Graph API error ${e.code}: ${e.message}${detail}`);
  }
  return json;
}

// Follow paging.next until exhausted
async function graphAll(pathname, params, opts) {
  const out = [];
  let page = await graph(pathname, { limit: 100, ...params }, opts);
  while (true) {
    out.push(...(page.data || []));
    if (!page.paging || !page.paging.next) break;
    const res = await fetch(page.paging.next);
    page = await res.json();
    if (page.error) throw new Error(`Graph API error: ${page.error.message}`);
  }
  return out;
}

function actionCount(actions, type) {
  const a = (actions || []).find((x) => x.action_type === type);
  return a ? Number(a.value) : 0;
}

// Meta reports leads under several action types depending on objective
function leadCount(actions) {
  return (
    actionCount(actions, "lead") ||
    actionCount(actions, "onsite_conversion.lead_grouped") ||
    actionCount(actions, "leadgen_grouped")
  );
}

// Upload a local image to the ad account's image library, returns image_hash.
async function uploadImage(filePath, { account, token }) {
  const bytes = fs.readFileSync(filePath);
  const form = new FormData();
  form.set("access_token", token);
  form.set("source", new Blob([bytes], { type: "image/png" }), path.basename(filePath));
  const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${account}/adimages`, {
    method: "POST",
    body: form,
  });
  const json = await res.json();
  if (json.error) throw new Error(`Image upload failed (${path.basename(filePath)}): ${json.error.message}`);
  const key = Object.keys(json.images)[0];
  return json.images[key].hash;
}

module.exports = { loadEnv, graph, graphAll, actionCount, leadCount, uploadImage, API_VERSION };
