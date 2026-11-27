#!/usr/bin/env node
// Read-only GHL connection check (Path B). Run before any build or publish:   node ops/ghl/check.js
// Shows: the Facebook integration (status, ad account, default Page), every ad account and Page the login can see,
// and the pixels GHL sees on the connected ad account. Warns when they don't match client/config.json.
const { call, redact, CFG } = require("./ghl");
const want = CFG.meta || {};
const warn = [];
try {
  const i = redact(call("GET", "/ad-publishing/facebook/integration"));
  console.log(`Integration: ${i.status} · pays: ${i.pricingModel} · ad account ${i.fbAdAccountId} · default Page ${i.fbDefaultPageId}`);
  console.log(`  Pages on the integration: ${(i.pages || []).map((p) => `${p.name} (${p.id})`).join(", ") || "none"}`);
  if (i.status !== "connected") warn.push(`Integration is ${i.status}: reconnect Facebook in GHL → Marketing → Ad Manager → settings.`);
  if (want.adAccountId && !/0000/.test(want.adAccountId) && i.fbAdAccountId !== want.adAccountId)
    warn.push(`GHL will publish to ${i.fbAdAccountId}, but config says ${want.adAccountId}. Disconnect + reconnect Facebook in Ad Manager and pick the right ad account (a draft's fbAdAccountId shows where it will spend).`);
  if (want.pageId && !/0000/.test(want.pageId) && i.fbDefaultPageId !== want.pageId)
    warn.push(`Default Page is ${i.fbDefaultPageId}, config says ${want.pageId}. Add/set the business's Page as default in Ad Manager.`);
} catch (e) { warn.push(e.status === 401 ? "Token refused (401): check the PIT and its scopes (adPublishing.readonly/.write, medias.readonly/.write)." : e.message); }

try {
  const accts = call("GET", "/ad-publishing/facebook/ad-accounts?fetchAll=true");
  console.log("Ad accounts this login can reach:");
  for (const a of accts) console.log(`  ${a.integrationConnected ? "●" : "○"} ${a.name} ${a.id} · ${a.accountStatus} · ${a.currency} · BM: ${a.business ? a.business.name : "none (personal)"}`);
} catch (e) { warn.push(e.message); }

try {
  const p = call("GET", "/ad-publishing/facebook/pages?limit=50&fetchExisting=true");
  console.log("Pages this login can reach:");
  for (const x of p.pages || p) console.log(`  ${x.isConnected ? "●" : "○"} ${x.name} ${x.id}${x.isDefault ? " (default)" : ""}`);
} catch (e) { warn.push(e.message); }

try {
  const px = call("GET", "/ad-publishing/facebook/pixels?projection=name,fbPixelId");
  const items = px.items || [];
  console.log(`Pixels on the connected ad account: ${items.map((x) => `${x.name} ${x.fbPixelId}`).join(", ") || "none"}`);
  if (want.pixelId && !/0000/.test(want.pixelId) && !items.some((x) => x.fbPixelId === want.pixelId))
    warn.push(`Pixel ${want.pixelId} is not on the connected ad account. Share it: Business settings → Data sources → Datasets → the pixel → Connected assets → add the ad account. Otherwise every ad fails with "Account does not have access to pixel".`);
} catch (e) { warn.push(e.message); }

try { call("GET", "/medias/files?limit=1&type=file&sortBy=createdAt&sortOrder=desc&altType=location&altId=" + require("./ghl").LOC, { version: "2021-07-28" }); }
catch (e) { if (e.status === 401 || e.status === 403) warn.push("Token can't use the media library: add scopes medias.readonly + medias.write to the PIT (needed to upload ad images)."); }

console.log(warn.length ? "\nFix before building:\n- " + warn.join("\n- ") : "\nAll good: ready to build drafts.");
process.exit(warn.length ? 2 : 0);
