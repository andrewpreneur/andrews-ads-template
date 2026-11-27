// Tiny GoHighLevel helper for the Ad Publishing + Medias APIs (Path B).
// Auth: the sub-account Private Integration Token (PIT). In Claude Code on the web it is a network secret for
// services.leadconnectorhq.com, injected by the proxy, so no token is ever in a file. For a local run, set GHL_TOKEN.
// Uses curl, not fetch: Node's fetch skips the session proxy and the token would never be added.
const { execFileSync } = require("child_process");
const fs = require("fs"), path = require("path");

const CFG_PATH = process.env.ADS_CONFIG || path.join(__dirname, "..", "..", "client", "config.json");
const CFG = JSON.parse(fs.readFileSync(CFG_PATH, "utf8"));
const LOC = process.env.GHL_LOCATION_ID || (CFG.ghl && CFG.ghl.locationId);
const BASE = "https://services.leadconnectorhq.com";
const TOKEN = process.env.GHL_TOKEN || "proxy-injected";

if (!LOC || /YOUR|0000/.test(LOC)) { console.error("No GHL location ID: set client/config.json → ghl.locationId"); process.exit(1); }

function call(method, p, { body, version = "v3", form } = {}) {
  const args = ["-sS", "-X", method, "-w", "\n%{http_code}", "-H", `Authorization: Bearer ${TOKEN}`, "-H", `Version: ${version}`, "-H", "Accept: application/json"];
  if (body) args.push("-H", "Content-Type: application/json", "--data-binary", JSON.stringify(body));
  if (form) for (const [k, v] of Object.entries(form)) args.push(k.startsWith("@") ? "-F" : "--form-string", k.startsWith("@") ? `file=@${v}` : `${k}=${v}`);
  const url = BASE + p + (p.includes("?") ? "&" : "?") + `locationId=${LOC}`;
  args.push(url);
  const out = execFileSync("curl", args, { maxBuffer: 50 * 1024 * 1024 }).toString();
  const i = out.lastIndexOf("\n");
  const status = +out.slice(i + 1);
  let data; try { data = JSON.parse(out.slice(0, i)); } catch { data = out.slice(0, i); }
  if (status >= 300) { const e = new Error(`${method} ${p} → ${status} ${JSON.stringify(redact(data)).slice(0, 400)}`); e.status = status; e.data = data; throw e; }
  return data;
}

// The integration response carries live Page access tokens: never print or save them.
const redact = (o) => Array.isArray(o) ? o.map(redact) : o && typeof o === "object"
  ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, /token/i.test(k) ? "[REDACTED]" : redact(v)])) : o;

const campaign = (id) => call("GET", `/ad-publishing/facebook/campaign/${id}?fields=adsets,ads`);
const summary = (c) => {
  const r = [`campaign  ${c.name}  ${c.publishingStatus}  fb=${c.fbCampaignId || "-"}  acct=${c.fbAdAccountId}${c.fbError ? "  ⚠ " + c.fbError : ""}`];
  for (const s of c.adsets || []) {
    r.push(`  ad set  ${s.name}  ${s.publishingStatus}  fb=${s.fbAdSetId || "-"}  $${s.budget && s.budget.amount}/${s.budget && s.budget.budgetType}  ${s.customEventType || ""} px=${s.pixelId || "-"}${s.fbError ? "  ⚠ " + s.fbError : ""}`);
    for (const a of s.ads || []) r.push(`    ad  ${a.name}  ${a.publishingStatus}  fb=${a.fbAdId || "-"}${a.fbError ? "  ⚠ " + String(a.fbError).slice(0, 160) : ""}`);
  }
  return r.join("\n");
};

module.exports = { call, redact, campaign, summary, CFG, CFG_PATH, LOC };
