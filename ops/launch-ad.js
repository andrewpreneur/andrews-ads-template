#!/usr/bin/env node
// Launch a Meta campaign (campaign → ad set → one or more ads) from a JSON config.
// SAFETY: everything is created PAUSED unless the config sets "status": "ACTIVE".
//
// Usage:
//   node launch-ad.js drafts/draft-a-winner.json           create paused
//   node launch-ad.js drafts/draft-a-winner.json --dry     print payloads, no API calls
//
// Ad formats supported (each entry in "ads"):
//   { "name": "...", "creative_id": "123" }                          reuse existing creative
//   { "name": "...", "creative": { link, message, headline,
//        image_path | image_hash, cta_type } }                       single image
//   { "name": "...", "carousel": { link, message, cta_type,
//        cards: [{ image_path, headline, description, link? }] } }   carousel
//
// image_path is a local file — it gets uploaded to the ad image library automatically.
const fs = require("fs");
const path = require("path");
const { loadEnv, graph, uploadImage, API_VERSION } = require("./lib");

const env = loadEnv();
const token = env.ACCESS_TOKEN;
const account = `act_${env.AD_ACCOUNT_ID}`;
const PAGE_ID = env.PAGE_ID || "";
const IG_USER_ID = env.IG_USER_ID || "";

const configPath = process.argv[2];
const dryRun = process.argv.includes("--dry");
if (!configPath) {
  console.error("Usage: node launch-ad.js <config.json> [--dry]");
  process.exit(1);
}
const cfg = JSON.parse(fs.readFileSync(configPath, "utf8"));
const status = cfg.status === "ACTIVE" ? "ACTIVE" : "PAUSED";

const uploadCache = new Map();
async function cachedUpload(imagePath) {
  if (!uploadCache.has(imagePath)) {
    uploadCache.set(imagePath, await uploadImage(imagePath, { account, token }));
    console.log(`    ↑ uploaded ${imagePath}`);
  }
  return uploadCache.get(imagePath);
}

const videoCache = new Map();
async function cachedVideoUpload(videoPath) {
  if (videoCache.has(videoPath)) return videoCache.get(videoPath);
  const bytes = fs.readFileSync(videoPath);
  const form = new FormData();
  form.set("access_token", token);
  form.set("source", new Blob([bytes], { type: "video/mp4" }), path.basename(videoPath));
  const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${account}/advideos`,
    { method: "POST", body: form });
  const json = await res.json();
  if (json.error) throw new Error(`Video upload failed: ${json.error.message}`);
  const id = json.id;
  console.log(`  video ${path.basename(videoPath)} → ${id}, waiting for Meta to process…`);
  // A creative referencing a still-encoding video is rejected, so poll until it is ready.
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 5000));
    const st = await graph(id, { fields: "status" }, { token }).catch(() => null);
    const phase = st?.status?.video_status;
    if (phase === "ready") { console.log("  ✔ video ready"); break; }
    if (phase === "error") throw new Error(`Video processing failed for ${videoPath}`);
    if (i === 59) throw new Error("Video still processing after 5 minutes");
  }
  videoCache.set(videoPath, id);
  return id;
}

async function buildCreative(ad) {
  if (ad.creative_id) return ad.creative_id;

  if (ad.video) {
    const v = ad.video;
    const videoId = v.video_id || (await cachedVideoUpload(v.video_path));
    const thumbHash = v.image_hash || (v.thumbnail_path ? await cachedUpload(v.thumbnail_path) : null);
    // When reusing an existing video by id we have Meta's own thumbnail URL, not a local file.
    const creative = await graph(`${account}/adcreatives`, {
      name: `${ad.name} creative`,
      object_story_spec: {
        page_id: v.page_id || PAGE_ID,
        instagram_user_id: v.instagram_user_id || IG_USER_ID,
        video_data: {
          video_id: videoId,
          message: v.message,
          ...(v.headline ? { title: v.headline } : {}),
          ...(v.description ? { link_description: v.description } : {}),
          ...(thumbHash ? { image_hash: thumbHash } : {}),
          ...(!thumbHash && v.image_url ? { image_url: v.image_url } : {}),
          ...(v.link_description ? { link_description: v.link_description } : {}),
          ...(v.cta_type ? { call_to_action: { type: v.cta_type, value: { link: v.link } } } : {}),
        },
      },
    }, { method: "POST", token });
    return creative.id;
  }

  if (ad.carousel) {
    const c = ad.carousel;
    const cards = [];
    for (const card of c.cards) {
      const hash = card.image_hash || (await cachedUpload(card.image_path));
      cards.push({
        link: card.link || c.link,
        image_hash: hash,
        ...(card.headline ? { name: card.headline } : {}),
        ...(card.description ? { description: card.description } : {}),
      });
    }
    const creative = await graph(`${account}/adcreatives`, {
      name: `${ad.name} creative`,
      object_story_spec: {
        page_id: c.page_id || PAGE_ID,
        instagram_user_id: c.instagram_user_id || IG_USER_ID,
        link_data: {
          link: c.link,
          message: c.message,
          child_attachments: cards,
          multi_share_optimized: c.optimize_card_order !== false,
          multi_share_end_card: false,
          ...(c.cta_type ? { call_to_action: { type: c.cta_type } } : {}),
        },
      },
    }, { method: "POST", token });
    return creative.id;
  }

  const cr = ad.creative;
  const hash = cr.image_hash || (cr.image_path ? await cachedUpload(cr.image_path) : null);
  const creative = await graph(`${account}/adcreatives`, {
    name: `${ad.name} creative`,
    object_story_spec: {
      page_id: cr.page_id || PAGE_ID,
      instagram_user_id: cr.instagram_user_id || IG_USER_ID,
      link_data: {
        link: cr.link,
        message: cr.message,
        ...(cr.headline ? { name: cr.headline } : {}),
        ...(cr.description ? { description: cr.description } : {}),
        ...(hash ? { image_hash: hash } : {}),
        ...(cr.cta_type ? { call_to_action: { type: cr.cta_type, value: { link: cr.link } } } : {}),
      },
    },
  }, { method: "POST", token });
  return creative.id;
}

// Fail before touching the account, not halfway through. A missing asset used to surface
// only when that ad was reached, leaving ads already created and every retry duplicating them.
function preflight(cfg) {
  const missing = [];
  for (const asCfg of cfg.adsets || [{ ...cfg.adset, ads: cfg.ads }]) {
    for (const ad of asCfg.ads || []) {
      const paths = [
        ad.creative?.image_path,
        ad.video?.video_path,
        ad.video?.thumbnail_path,
        ...((ad.carousel?.cards || []).map((c) => c.image_path)),
      ].filter(Boolean);
      for (const f of paths) if (!fs.existsSync(f)) missing.push(`${ad.name}: ${f}`);
    }
  }
  if (missing.length) {
    console.error(`\n✖ ${missing.length} asset(s) missing — nothing was created:\n` +
      missing.map((m) => "   " + m).join("\n") + "\n");
    process.exit(1);
  }
}

(async () => {
  preflight(cfg);
  if (dryRun) {
    console.log("DRY RUN — nothing will be created. Config:");
    console.log(JSON.stringify({ account, status, ...cfg }, null, 2));
    return;
  }

  // If cfg.campaign_id is set, skip campaign creation and add ad sets to it.
  if (cfg.campaign_id) {
    console.log(`Adding to existing campaign ${cfg.campaign_id}…`);
    const adsetCfgs2 = cfg.adsets || [{ ...cfg.adset, ads: cfg.ads }];
    for (const asCfg of adsetCfgs2) {
      if (asCfg.adset_id) {
        console.log(`Adding ads to existing ad set ${asCfg.adset_id}…`);
        for (const adCfg of asCfg.ads) {
          const creativeId = await buildCreative(adCfg);
          const ad = await graph(`${account}/ads`, {
            name: adCfg.name, adset_id: asCfg.adset_id, status, creative: { creative_id: creativeId },
          }, { method: "POST", token });
          console.log(`  ✔ ad ${ad.id} (creative ${creativeId})`);
        }
        continue;
      }
      console.log(`Creating ad set "${asCfg.name}"…`);
      const adset = await graph(`${account}/adsets`, {
        name: asCfg.name,
        campaign_id: cfg.campaign_id,
        status,
        ...(asCfg.daily_budget_cents ? { daily_budget: asCfg.daily_budget_cents, bid_strategy: asCfg.bid_strategy || "LOWEST_COST_WITHOUT_CAP" } : {}),
        ...(asCfg.daily_min_spend_target ? { daily_min_spend_target: asCfg.daily_min_spend_target } : {}),
        billing_event: asCfg.billing_event || "IMPRESSIONS",
        optimization_goal: asCfg.optimization_goal || "OFFSITE_CONVERSIONS",
        attribution_spec: asCfg.attribution_spec || [{ event_type: "CLICK_THROUGH",
          window_days: ["LANDING_PAGE_VIEWS", "LINK_CLICKS", "REACH", "IMPRESSIONS",
                        "POST_ENGAGEMENT"].includes(asCfg.optimization_goal) ? 1 : 7 }],
        targeting: asCfg.targeting,
        ...(asCfg.promoted_object ? { promoted_object: asCfg.promoted_object } : {}),
      }, { method: "POST", token });
      console.log(`  ✔ ad set ${adset.id}`);
      for (const adCfg of asCfg.ads) {
        console.log(`Creating ad "${adCfg.name}"…`);
        const creativeId = await buildCreative(adCfg);
        const ad = await graph(`${account}/ads`, {
          name: adCfg.name, adset_id: adset.id, status, creative: { creative_id: creativeId },
        }, { method: "POST", token });
        console.log(`  ✔ ad ${ad.id} (creative ${creativeId})`);
      }
    }
    console.log(`\nDone. Everything is ${status}.`);
    return;
  }

  const isCBO = !!cfg.campaign.daily_budget_cents;
  console.log(`Creating campaign "${cfg.campaign.name}" (${status}${isCBO ? `, CBO $${cfg.campaign.daily_budget_cents / 100}/day` : ""})…`);
  const campaign = await graph(`${account}/campaigns`, {
    name: cfg.campaign.name,
    objective: cfg.campaign.objective || "OUTCOME_SALES",
    status,
    special_ad_categories: cfg.campaign.special_ad_categories || [],
    ...(isCBO ? {
      daily_budget: cfg.campaign.daily_budget_cents,
      bid_strategy: cfg.campaign.bid_strategy || "LOWEST_COST_WITHOUT_CAP",
    } : { is_adset_budget_sharing_enabled: false }),
  }, { method: "POST", token });
  console.log(`  ✔ campaign ${campaign.id}`);

  // Accept either a single cfg.adset + cfg.ads, or cfg.adsets: [{...adset, ads: [...]}]
  const adsetCfgs = cfg.adsets || [{ ...cfg.adset, ads: cfg.ads }];
  for (const asCfg of adsetCfgs) {
    console.log(`Creating ad set "${asCfg.name}"…`);
    const adset = await graph(`${account}/adsets`, {
      name: asCfg.name,
      campaign_id: campaign.id,
      status,
      ...(isCBO ? {} : { daily_budget: asCfg.daily_budget_cents, bid_strategy: asCfg.bid_strategy || "LOWEST_COST_WITHOUT_CAP" }),
      billing_event: asCfg.billing_event || "IMPRESSIONS",
      optimization_goal: asCfg.optimization_goal || "OFFSITE_CONVERSIONS",
      attribution_spec: asCfg.attribution_spec || [{ event_type: "CLICK_THROUGH",
          window_days: ["LANDING_PAGE_VIEWS", "LINK_CLICKS", "REACH", "IMPRESSIONS",
                        "POST_ENGAGEMENT"].includes(asCfg.optimization_goal) ? 1 : 7 }],
      targeting: asCfg.targeting,
      ...(asCfg.promoted_object ? { promoted_object: asCfg.promoted_object } : {}),
    }, { method: "POST", token });
    console.log(`  ✔ ad set ${adset.id}`);

    for (const adCfg of asCfg.ads) {
      console.log(`Creating ad "${adCfg.name}"…`);
      const creativeId = await buildCreative(adCfg);
      const ad = await graph(`${account}/ads`, {
        name: adCfg.name,
        adset_id: adset.id,
        status,
        creative: { creative_id: creativeId },
      }, { method: "POST", token });
      console.log(`  ✔ ad ${ad.id} (creative ${creativeId})`);
    }
  }

  console.log(`\nDone. Everything is ${status}.`);
  if (status === "PAUSED") {
    console.log("Review in Ads Manager, then flip it live (or ask Claude to activate it).");
  }
  console.log(`https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${env.AD_ACCOUNT_ID}`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
