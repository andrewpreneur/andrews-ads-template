#!/usr/bin/env node
// Sends new or changed action items from copilot/plan.json to the team's agent webhook.
// Each item goes once per change: copilot/actions-sent.json remembers a hash of what was last sent.
// Env: ACTIONS_WEBHOOK_URL (required); ACTIONS_WEBHOOK_HEADER + ACTIONS_WEBHOOK_KEY (optional: the auth header's
// name and value, e.g. "x-api-key"); ACTIONS_WEBHOOK_SECRET (optional: HMAC-signs the body as X-Signature-256).
// Usage: node push-actions.js [--dry | --test]
//   --dry   prints what would be sent and changes nothing
//   --test  sends one "action.test" message to check the connection, and records nothing
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dry = process.argv.includes("--dry");
const test = process.argv.includes("--test");
const dir = path.join(__dirname, "copilot");
const plan = JSON.parse(fs.readFileSync(path.join(dir, "plan.json"), "utf8"));
const statePath = path.join(dir, "actions-sent.json");
const sent = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};
const url = process.env.ACTIONS_WEBHOOK_URL;
const secret = process.env.ACTIONS_WEBHOOK_SECRET;
// ACTIONS_WEBHOOK_HEADER is normally just the header name ("Authorization"), with the value in ACTIONS_WEBHOOK_KEY.
// If the whole line was saved instead ("Authorization: Bearer abc"), split it. Never print either value.
let authHeader = (process.env.ACTIONS_WEBHOOK_HEADER || "").trim();
let authKey = (process.env.ACTIONS_WEBHOOK_KEY || "").trim();
if (authHeader.includes(":")) {
  const i = authHeader.indexOf(":");
  const fromLine = authHeader.slice(i + 1).trim();
  if (fromLine) authKey = fromLine; // the saved line holds the exact value the receiver expects
  authHeader = authHeader.slice(0, i).trim();
}
// An Authorization value without a scheme ("Bearer ...") is rejected by the receiver, so add it.
if (/^authorization$/i.test(authHeader) && authKey && !/\s/.test(authKey)) authKey = "Bearer " + authKey;

function headersFor(body, idempotencyKey) {
  const h = { "Content-Type": "application/json", "Idempotency-Key": idempotencyKey };
  if (authHeader && authKey) h[authHeader] = authKey;
  if (secret) h["X-Signature-256"] = "sha256=" + crypto.createHmac("sha256", secret).update(body).digest("hex");
  return h;
}

// planUpdated is left out of the hash so editing one item does not resend all the others.
const hash = ({ planUpdated, ...o }) => crypto.createHash("sha256").update(JSON.stringify(o)).digest("hex").slice(0, 16);

// Approvals belong to the owner and are given in their own words, so only agent action items go out.
const items = plan.todos.map((t) => ({ ...t, source: "meta-ads-kit", planUpdated: plan.updated }));
const due = items.filter((t) => sent[t.id] !== hash(t));

(async () => {
  if (test) {
    if (!url) throw new Error("ACTIONS_WEBHOOK_URL is not set; add it in the environment settings.");
    const body = JSON.stringify({ event: "action.test", sentAt: new Date().toISOString(),
      action: { id: "test", title: "Connection test from the Meta ads agent. No action needed.", owner: "Claude (Media Buying)", source: "meta-ads-kit" } });
    const res = await fetch(url, { method: "POST", headers: headersFor(body, `test-${Date.now()}`), body });
    const text = (await res.text()).slice(0, 300);
    console.log(`Webhook answered ${res.status} ${res.statusText}${text ? ": " + text : ""}`);
    if (!res.ok) process.exit(1);
    return;
  }
  if (!due.length) return console.log("No new or changed action items.");
  if (!url && !dry) {
    console.error("ACTIONS_WEBHOOK_URL is not set; add it in the environment settings. Nothing was sent.");
    process.exit(1);
  }
  for (const t of due) {
    const body = JSON.stringify({
      event: sent[t.id] ? "action.updated" : "action.created",
      sentAt: new Date().toISOString(),
      action: t,
    });
    if (dry) {
      console.log(`[dry] ${t.id} → ${t.owner}: ${t.title}`);
      continue;
    }
    const res = await fetch(url, { method: "POST", headers: headersFor(body, `${t.id}-${hash(t)}`), body });
    if (!res.ok) {
      console.error(`✖ ${t.id}: webhook answered ${res.status}. Stopping; the rest will go next run.`);
      break;
    }
    sent[t.id] = hash(t);
    fs.writeFileSync(statePath, JSON.stringify(sent, null, 2) + "\n");
    console.log(`✔ ${t.id} → ${t.owner}: ${t.title}`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
