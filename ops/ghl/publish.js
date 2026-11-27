#!/usr/bin/env node
// Publish a GHL campaign draft to Meta (NEW SPEND = risk 8+: only after the owner's yes in their own words).
//   node ops/ghl/publish.js <ghlCampaignId> --yes
// Checks the draft spends on the configured ad account, publishes, polls until done and prints every object's status
// and Meta error. Log the result in reports/YYYY-MM-DD-changes.md.
const { execFileSync } = require("child_process");
const { call, campaign, summary, CFG, LOC } = require("./ghl");
const id = process.argv[2];
if (!id || !process.argv.includes("--yes")) { console.error("usage: node ops/ghl/publish.js <ghlCampaignId> --yes   (only with the owner's yes)"); process.exit(1); }
const before = campaign(id);
const want = CFG.meta && CFG.meta.adAccountId;
if (want && !/0000/.test(want) && before.fbAdAccountId !== want) { console.error(`Refusing: draft spends on ${before.fbAdAccountId}, config says ${want}.`); process.exit(1); }
const live = (before.adsets || []).reduce((n, s) => n + (s.budget ? s.budget.amount : 0), 0);
console.log(`Publishing "${before.name}" ($${live}/day) to ${before.fbAdAccountId}…`);
call("POST", `/ad-publishing/facebook/campaigns/${id}/publish`, { body: { locationId: LOC } });
let c;
for (let i = 0; i < 30; i++) {
  execFileSync("sleep", ["10"]);
  c = campaign(id);
  const s = summary(c);
  if (!/PUBLISHING|DRAFT/.test(s)) break;
  process.stdout.write(".");
}
console.log("\n" + summary(c));
console.log(/WITH_ISSUES|REJECTED|FAILED|⚠/.test(summary(c)) ? "\n⚠ Something needs fixing (see ⚠ lines). Common: pixel not shared with the ad account." : "\nPublished. Ads usually sit IN_REVIEW for minutes to 24h. Hands off for 72h.");
