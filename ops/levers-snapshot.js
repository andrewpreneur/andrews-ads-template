#!/usr/bin/env node
// Builds levers.json for the Ads HQ page's Levers tab: the last 12 months, ranked at each funnel step
// (cheap views, click-through, opt-in, purchase) for each lever (creative, headline, offer, landing page,
// audience). Only the top few per step are kept; creative thumbnails are embedded as data URIs.
// Read-only: it only GETs from Meta. Usage: node levers-snapshot.js [out.json]
// Patterns (the written analysis for the agents) live in copilot/patterns.json and are merged in as-is.
const fs = require("fs");
const path = require("path");
const { loadEnv, graph, graphAll, actionCount } = require("./lib");

const env = loadEnv();
const token = env.ACCESS_TOKEN;
const account = `act_${env.AD_ACCOUNT_ID}`;
const outPath = process.argv[2] || path.join(__dirname, "copilot", "levers.json");
const TOP = 9; // per step and lever: the page shows 3 and loads the rest on request

// The four steps of the funnel, each with the minimum volume a row needs before it can rank.
const STEPS = [
  // Reach only counts if people also click (CTR >= 0.75%), so engagement-only ads can't win on cheap impressions.
  { id: "views", label: "Cheapest reach", metric: "cpm", order: 1, min: (m) => m.impressions >= 10000 && m.ctr >= 0.75 },
  { id: "ctr", label: "Clicks", metric: "ctr", order: -1, min: (m) => m.impressions >= 3000 && m.linkClicks >= 30 },
  { id: "optin", label: "Opt-ins", metric: "costPerOptin", order: 1, min: (m) => m.optins >= 10 && m.spend >= 100 },
  { id: "purchase", label: "Purchases", metric: "costPerPurchase", order: 1, min: (m) => m.purchases >= 3 && m.spend >= 100 },
];

const round = (n, d = 2) => Math.round(n * 10 ** d) / 10 ** d;
const value = (list, type) => {
  const a = (list || []).find((x) => x.action_type === type);
  return a ? Number(a.value) : 0;
};

// Which offer an ad sells, from its landing page URL, using the offers listed in client/config.json.
const config = (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, "..", "client", "config.json"), "utf8")); } catch { return {}; } })();
const offers = (config.offers || []).filter((o) => o.name && o.match);
function offerOf(url, objective) {
  if (!url) return /ENGAGEMENT|AWARENESS|VIDEO|POST|PAGE_LIKES/.test(objective || "") ? "Engagement (no page)" : "Video post (link inside the post)";
  const u = url.toLowerCase();
  if (/messenger|m\.me\//.test(u)) return "Messenger";
  const hit = offers.find((o) => new RegExp(o.match, "i").test(u));
  return hit ? hit.name : "Other";
}

function pageOf(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return (u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/$/, "")) || u.hostname;
  } catch {
    return url.split("?")[0];
  }
}

function creativeInfo(c) {
  c = c || {};
  const spec = c.object_story_spec || {};
  const link = spec.link_data || {};
  const video = spec.video_data || {};
  const feed = c.asset_feed_spec || {};
  const url =
    link.link || (video.call_to_action && video.call_to_action.value && video.call_to_action.value.link) ||
    (feed.link_urls && feed.link_urls[0] && feed.link_urls[0].website_url) || c.link_url || null;
  const headline = c.title || link.name || video.title || (feed.titles && feed.titles[0] && feed.titles[0].text) || "";
  const body = c.body || link.message || video.message || (feed.bodies && feed.bodies[0] && feed.bodies[0].text) || "";
  const format = c.video_id || video.video_id || (feed.videos && feed.videos.length) ? "Video"
    : link.child_attachments ? "Carousel" : "Image";
  return {
    url,
    headline: headline.trim(),
    hook: body.split("\n").map((s) => s.trim()).find(Boolean) || "",
    body: body.trim(),
    cta: c.call_to_action_type || "",
    format,
    postId: c.effective_object_story_id || null,
    thumb: c.thumbnail_url || null,
  };
}

function metrics(rows) {
  const m = { spend: 0, impressions: 0, linkClicks: 0, lpv: 0, leads: 0, regs: 0, optins: 0, checkouts: 0, purchases: 0, revenue: 0, convos: 0, video3s: 0, thruplays: 0, ads: 0 };
  for (const r of rows) {
    m.ads += 1;
    m.spend += r.spend;
    m.impressions += r.impressions;
    m.linkClicks += r.linkClicks;
    m.lpv += r.lpv;
    m.leads += r.leads;
    m.regs += r.regs;
    m.optins += r.optins;
    m.checkouts += r.checkouts;
    m.purchases += r.purchases;
    m.revenue += r.revenue;
    m.convos += r.convos;
    m.video3s += r.video3s;
    m.thruplays += r.thruplays;
  }
  return derive(m);
}
function derive(m) {
  for (const k of ["spend", "revenue"]) m[k] = round(m[k]);
  m.ctr = m.impressions ? round((m.linkClicks / m.impressions) * 100) : null;
  m.cpm = m.impressions ? round((m.spend / m.impressions) * 1000) : null;
  m.costPerOptin = m.optins ? round(m.spend / m.optins) : null;
  m.cpc = m.linkClicks ? round(m.spend / m.linkClicks) : null;
  m.lpvRate = m.linkClicks ? round((m.lpv / m.linkClicks) * 100, 1) : null;
  m.costPerLead = m.leads ? round(m.spend / m.leads) : null;
  m.costPerReg = m.regs ? round(m.spend / m.regs) : null;
  m.costPerPurchase = m.purchases ? round(m.spend / m.purchases) : null;
  m.roas = m.spend ? round(m.revenue / m.spend) : null;
  m.hookRate = m.impressions && m.video3s ? round((m.video3s / m.impressions) * 100, 1) : null;
  return m;
}
function groupBy(rows, keyFn, minSpend = 0) {
  const g = {};
  for (const r of rows) {
    const k = keyFn(r);
    if (k == null || k === "") continue;
    (g[k] ||= []).push(r);
  }
  return Object.entries(g)
    .map(([key, rs]) => ({ key, ...metrics(rs) }))
    .filter((x) => x.spend >= minSpend)
    .sort((a, b) => b.spend - a.spend);
}

function audienceOf(t) {
  if (!t) return "Unknown";
  const ca = (t.custom_audiences || []).map((a) => a.name || a.id);
  const lal = ca.filter((n) => /lookalike|lal/i.test(n));
  const parts = [];
  if (lal.length) parts.push("Lookalike: " + lal.join(", "));
  const other = ca.filter((n) => !/lookalike|lal/i.test(n));
  if (other.length) parts.push("Custom: " + other.join(", "));
  const interests = (t.flexible_spec || []).flatMap((f) => [...(f.interests || []), ...(f.behaviors || [])]).map((i) => i.name);
  if (interests.length) parts.push("Interests: " + interests.slice(0, 4).join(", ") + (interests.length > 4 ? "…" : ""));
  if (!parts.length) parts.push(t.geo_locations && t.geo_locations.custom_locations ? "Local radius" : "Broad");
  return parts.join(" · ");
}

(async () => {
  // Last 12 months.
  const today = new Date();
  const since = new Date(today.getTime() - 365 * 86400000).toISOString().slice(0, 10);
  const range = { since, until: today.toISOString().slice(0, 10) };

  const [insights, ads, adsets] = await Promise.all([
    graphAll(`${account}/insights`, {
      level: "ad", time_range: range, limit: 500,
      fields: "ad_id,adset_id,spend,impressions,inline_link_clicks,actions,action_values,video_thruplay_watched_actions",
    }, { token }),
    graphAll(`${account}/ads`, {
      limit: 200,
      fields: "id,name,status,created_time,campaign{name,objective},creative.thumbnail_width(320).thumbnail_height(320){title,body,call_to_action_type,object_story_spec,asset_feed_spec,video_id,link_url,effective_object_story_id,thumbnail_url}",
    }, { token }),
    graphAll(`${account}/adsets`, { limit: 200, fields: "id,name,optimization_goal,targeting" }, { token }),
  ]);

  const adById = Object.fromEntries(ads.map((a) => [a.id, a]));
  const setById = Object.fromEntries(adsets.map((s) => [s.id, s]));
  const row = (r) => {
    const leads = actionCount(r.actions, "lead");
    const regs = actionCount(r.actions, "complete_registration");
    return {
      spend: Number(r.spend || 0),
      impressions: Number(r.impressions || 0),
      linkClicks: Number(r.inline_link_clicks || 0),
      lpv: actionCount(r.actions, "landing_page_view"),
      leads,
      regs,
      // One opt-in per person: a signup can fire both Lead and CompleteRegistration, so take the larger, not the sum.
      optins: Math.max(leads, regs),
      checkouts: actionCount(r.actions, "initiate_checkout"),
      purchases: actionCount(r.actions, "omni_purchase"),
      revenue: value(r.action_values, "omni_purchase"),
      convos: actionCount(r.actions, "onsite_conversion.messaging_conversation_started_7d"),
      video3s: actionCount(r.actions, "video_view"),
      thruplays: value(r.video_thruplay_watched_actions, "video_view"),
    };
  };

  const rows = insights
    .filter((r) => Number(r.spend) > 0)
    .map((r) => {
      const ad = adById[r.ad_id] || {};
      const set = setById[r.adset_id] || {};
      const c = creativeInfo(ad.creative);
      const objective = ad.campaign ? ad.campaign.objective : "";
      const offer = offerOf(c.url, objective);
      return {
        id: r.ad_id,
        name: ad.name || r.ad_id,
        status: ad.status || "UNKNOWN",
        campaign: ad.campaign ? ad.campaign.name : "",
        audience: audienceOf(set.targeting),
        offer,
        page: pageOf(c.url),
        ...c,
        ...row(r),
      };
    })
    ;

  // Rank one lever's groups at each step; keep the top few.
  function rank(groups) {
    const out = {};
    for (const st of STEPS) {
      out[st.id] = groups
        .filter((g) => g[st.metric] != null && st.min(g))
        .sort((a, b) => st.order * (a[st.metric] - b[st.metric]) || b.spend - a.spend)
        .slice(0, TOP);
    }
    return out;
  }
  const slim = (g) => ({
    key: g.key, spend: g.spend, impressions: g.impressions, cpm: g.cpm, ctr: g.ctr, linkClicks: g.linkClicks,
    video3s: g.video3s, optins: g.optins, costPerOptin: g.costPerOptin, purchases: g.purchases,
    costPerPurchase: g.costPerPurchase, roas: g.roas, ads: g.ads,
  });
  const lever = (keyFn) => {
    const r = rank(groupBy(rows, keyFn));
    for (const k of Object.keys(r)) r[k] = r[k].map(slim);
    return r;
  };

  // Creatives: one row per ad, with its headline, offer and page so the agents know what to reuse.
  // The same creative often runs in several ad sets (sometimes as separate posts); judge it once, by ad name.
  const postKey = (r) => r.name || r.postId || r.id;
  const creativeRanks = rank(groupBy(rows, postKey));
  const byId = {};
  for (const r of [...rows].sort((a, b) => a.spend - b.spend)) byId[postKey(r)] = r; // highest-spend ad names the post
  const shown = new Set(Object.values(creativeRanks).flat().map((g) => g.key));
  const thumbs = {};
  await Promise.all([...shown].map(async (id) => {
    const r = byId[id];
    if (!r || !r.thumb) return;
    try {
      const res = await fetch(r.thumb);
      if (!res.ok) return;
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 3000) return; // Meta's grey placeholder, not the creative
      thumbs[r.id] = `data:${res.headers.get("content-type") || "image/jpeg"};base64,${buf.toString("base64")}`;
    } catch { /* a missing thumbnail only hides the image */ }
  }));
  const creatives = {};
  for (const [step, list] of Object.entries(creativeRanks)) {
    creatives[step] = list.map((g) => {
      const r = byId[g.key];
      return { ...slim(g), key: r.name, id: r.id, status: rows.some((x) => postKey(x) === g.key && x.status === "ACTIVE") ? "ACTIVE" : r.status, headline: r.headline, hook: r.hook, offer: r.offer,
        page: r.page, format: r.format, postId: r.postId, thumb: thumbs[r.id] || null };
    });
  }

  const total = metrics(rows);
  const data = {
    generatedAt: new Date().toISOString(),
    range,
    steps: STEPS.map(({ id, label, metric }) => ({ id, label, metric })),
    total: slim({ key: "All ads", ...total }),
    levers: {
      creative: creatives,
      headline: lever((r) => r.headline),
      offer: lever((r) => r.offer),
      page: lever((r) => r.page),
      audience: lever((r) => r.audience),
    },
    caveats: [
      "Last 12 months, as Meta reports them.",
      "Results counted outside Meta (CRM, Stripe, texts) don't show here; ads that win on those rank on clicks and reach.",
    ],
    patterns: (() => { try { return JSON.parse(fs.readFileSync(path.join(__dirname, "copilot", "patterns.json"), "utf8")); } catch { return {}; } })(),
  };
  fs.writeFileSync(outPath, JSON.stringify(data) + "\n");
  console.error(`Wrote ${outPath}: ${rows.length} ads since ${since}, $${total.spend}, ${Object.keys(thumbs).length} thumbnails`);
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
