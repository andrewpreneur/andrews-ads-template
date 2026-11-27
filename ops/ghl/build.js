#!/usr/bin/env node
// Build a campaign in GHL Ad Manager as a DRAFT (nothing reaches Meta, risk 0-7):
//   node ops/ghl/build.js ops/drafts/my-campaign.json [--dry]
// Uploads local images to the GHL media library, creates campaign → ad set → ads, prints the read-back and writes the
// GHL ids into the draft file under "_ghl". Publishing is a separate, approved step: node ops/ghl/publish.js <id> --yes
// Draft format: see ops/drafts/example-ghl.json. Budgets are DOLLARS here (GHL), not cents (Graph API).
const fs = require("fs"), path = require("path");
const { call, campaign, summary, CFG, LOC } = require("./ghl");
const file = process.argv[2], dry = process.argv.includes("--dry");
if (!file) { console.error("usage: node ops/ghl/build.js <draft.json> [--dry]"); process.exit(1); }
const D = JSON.parse(fs.readFileSync(file, "utf8"));
const meta = CFG.meta || {};
const pageId = D.adset.pageId || meta.pageId, pixelId = D.adset.pixelId || meta.pixelId;
const problems = [];
if (!pageId || /0000/.test(pageId)) problems.push("no Page id (config meta.pageId)");
if (D.adset.conversionLocation !== "on_ad" && (!pixelId || /0000/.test(pixelId))) problems.push("no pixel id (config meta.pixelId)");
if (D.adset.dailyBudget > (CFG.budget && CFG.budget.accountDailyCap || Infinity)) problems.push(`daily budget $${D.adset.dailyBudget} is over the account cap`);
for (const a of D.ads) if (!a.image || !a.text || !a.headline) problems.push(`ad ${a.name}: needs image, text, headline`);
if (problems.length) { console.error("Fix the draft first:\n- " + problems.join("\n- ")); process.exit(1); }

const upload = (p) => {
  if (/^https?:\/\//.test(p)) return p;
  const abs = path.resolve(path.dirname(file), p);
  const r = call("POST", `/medias/upload-file?altId=${LOC}&altType=location`, { version: "2021-07-28", form: { "@file": abs, name: path.basename(abs), hosted: "false" } });
  return r.url;
};

if (dry) {
  console.log(`DRY RUN: would create "${D.campaign.name}" (${D.campaign.objective || "OUTCOME_LEADS"}), ad set "${D.adset.name}" $${D.adset.dailyBudget}/day ${D.adset.customEventType || "LEAD"} on pixel ${pixelId}, ${D.ads.length} ads → ${D.link}`);
  process.exit(0);
}
const c = call("PUT", "/ad-publishing/facebook/campaigns", { body: { locationId: LOC, name: D.campaign.name, objective: D.campaign.objective || "OUTCOME_LEADS", specialAdCategories: D.campaign.specialAdCategories || ["NONE"] } });
console.log(`campaign draft ${c.id} → will spend on ${c.fbAdAccountId}`);
if (meta.adAccountId && !/0000/.test(meta.adAccountId) && c.fbAdAccountId !== meta.adAccountId)
  console.warn(`⚠ This draft belongs to ${c.fbAdAccountId}, not ${meta.adAccountId}. Do NOT publish: fix the ad account in Ad Manager and build again.`);
const s = call("PUT", "/ad-publishing/facebook/adsets", { body: { locationId: LOC, campaignId: c.id, name: D.adset.name, pageId,
  ...(D.adset.instagramActorId ? { instagramActorId: D.adset.instagramActorId } : {}),
  audience: { geoLocations: (D.adset.countries || ["US"]).map((k) => ({ key: k, name: k, type: "country", selectionType: "include" })),
    ageMin: D.adset.ageMin || 18, ageMax: D.adset.ageMax || 65, placementType: "auto" },
  budget: { budgetType: "DAILY", amount: D.adset.dailyBudget },
  conversionLocation: D.adset.conversionLocation || "website",
  ...(D.adset.conversionLocation === "on_ad" ? {} : { customEventType: D.adset.customEventType || "LEAD", pixelId }) } });
for (const a of D.ads) {
  const src = upload(a.image);
  call("PUT", "/ad-publishing/facebook/ads", { body: { locationId: LOC, campaignId: c.id, adsetId: s.id, name: a.name, mediaType: "SINGLE", multiAdvertiserAds: false,
    media: [{ src, type: "image", name: a.name + ".png" }], primaryTexts: [{ text: a.text }], headlines: [{ text: a.headline }],
    descriptions: [{ text: a.description || "" }], cta: a.cta || D.cta || "SIGN_UP",
    ...(D.adset.conversionLocation === "on_ad" ? { destinationFormId: D.formId } : { destinationLink: a.link || D.link }) } });
  console.log(`  ad draft ${a.name}`);
}
D._ghl = { campaignId: c.id, adsetId: s.id, adAccount: c.fbAdAccountId, builtAt: new Date().toISOString() };
fs.writeFileSync(file, JSON.stringify(D, null, 2) + "\n");
console.log("\n" + summary(campaign(c.id)));
console.log(`\nDraft only. Review it, run the 4 creative checks, get the owner's yes, then: node ops/ghl/publish.js ${c.id} --yes`);
