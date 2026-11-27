#!/usr/bin/env node
// Read-only status + numbers for a GHL campaign:   node ops/ghl/status.js <ghlCampaignId> [days=7]
// "leads" = contacts GHL attributed to the campaign (CRM), "conversions" = Meta's pixel count. Judge on the CRM number.
// Pause (risk 8+, owner's yes): node ops/ghl/status.js <id> --pause --yes
const { call, campaign, summary, LOC } = require("./ghl");
const id = process.argv[2];
if (!id) { console.error("usage: node ops/ghl/status.js <ghlCampaignId> [days] [--pause --yes]"); process.exit(1); }
if (process.argv.includes("--pause")) {
  if (!process.argv.includes("--yes")) { console.error("Pausing a campaign is 8+: add --yes only with the owner's yes."); process.exit(1); }
  call("POST", `/ad-publishing/facebook/campaigns/${id}/pause`, { body: { locationId: LOC } });
}
const days = +(process.argv[3] || 7) || 7;
const end = new Date(), start = new Date(Date.now() - (days - 1) * 864e5);
const d = (x) => x.toISOString().slice(0, 10);
console.log(summary(campaign(id)));
try {
  const r = call("GET", `/ad-publishing/facebook/reporting/campaign/${id}?startDate=${d(start)}&endDate=${d(end)}`);
  const spend = +r.spend || 0, leads = +r.leads || 0;
  console.log(`\nLast ${days} days: spend $${spend.toFixed(2)} · impressions ${r.impressions} · clicks ${r.clicks} · CTR ${(+r.ctr || 0).toFixed(2)}% · Meta conversions ${r.conversions} · CRM leads ${leads} · cost per CRM lead ${leads ? "$" + (spend / leads).toFixed(2) : "-"}`);
} catch (e) { console.log(`\nNo reporting yet (${e.status || e.message}). Published campaigns only.`); }
