#!/usr/bin/env node
// Builds data.json for the Ads HQ page: today / yesterday / 7-day numbers per ad set, cost per result,
// tier, armed spend, the best ads of the last 30 days, revenue (if reported) and the plan.
// Read-only: it only GETs from Meta. Usage: node copilot-snapshot.js [out.json]  (default: stdout)
// Business rules come from client/config.json; offline results (CRM/Stripe counts) from client/results.json.
const fs = require("fs");
const path = require("path");
const { loadEnv, graph, graphAll, actionCount } = require("./lib");

const env = loadEnv();
const token = env.ACCESS_TOKEN;
const account = `act_${env.AD_ACCOUNT_ID}`;
const dir = path.join(__dirname, "copilot");
const root = path.join(__dirname, "..");
const readJson = (p, fallback) => { try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return fallback; } };
const config = readJson(path.join(root, "client", "config.json"), {});
const plan = readJson(path.join(dir, "plan.json"), { approvals: [], todos: [], suggestions: [], weeks: [], rules: [] });
const offline = readJson(path.join(root, "client", "results.json"), { byDay: {} });

const result = config.result || { name: "leads", metaAction: "lead", offline: false };
const tiers = config.tiers || {};

function tierOf(cost, spend) {
  if (!tiers.scaleBelow || !tiers.holdUpTo || !tiers.lowerUpTo) return null; // tiers not set yet
  if (cost == null) return spend >= tiers.lowerUpTo ? "Kill (no results)" : null;
  if (cost < tiers.scaleBelow) return "Scale";
  if (cost <= tiers.holdUpTo) return "Hold";
  if (cost <= tiers.lowerUpTo) return "Lower budget";
  return "Kill";
}

const round = (n) => Math.round(n * 100) / 100;

function dayInTz(tz, offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

(async () => {
  const acct = await graph(account, { fields: "timezone_name,currency,name" }, { token });
  const tz = acct.timezone_name;
  const today = dayInTz(tz);
  const yesterday = dayInTz(tz, -1);
  const since = dayInTz(tz, -7);

  const [adsets, rows] = await Promise.all([
    graphAll(`${account}/adsets`, { fields: "id,name,status,daily_budget,optimization_goal,campaign{id,name,status,daily_budget}" }, { token }),
    graphAll(`${account}/insights`, {
      level: "adset",
      time_increment: 1,
      time_range: { since, until: today },
      fields: "adset_id,spend,actions,date_start",
    }, { token }),
  ]);

  // Pause by each object's own status: an ad set ACTIVE under a paused campaign is "armed".
  const statusOf = (a) =>
    a.status !== "ACTIVE" ? "PAUSED" : a.campaign && a.campaign.status === "ACTIVE" ? "ACTIVE" : "ARMED";
  const byId = Object.fromEntries(adsets.map((a) => [a.id, a]));

  const cell = () => ({ spend: 0, lpv: 0, results: 0 });
  const stats = {};
  const daily = {};
  for (const r of rows) {
    const s = (stats[r.adset_id] ||= { today: cell(), yesterday: cell(), last7: cell() });
    const bucket = r.date_start === today ? [s.today] : r.date_start === yesterday ? [s.yesterday, s.last7] : [s.last7];
    const spend = Number(r.spend || 0);
    for (const b of bucket) {
      b.spend += spend;
      b.lpv += actionCount(r.actions, "landing_page_view");
      if (!result.offline) b.results += actionCount(r.actions, result.metaAction);
    }
    daily[r.date_start] = (daily[r.date_start] || 0) + spend;
  }
  // Offline results (CRM / Stripe counts), keyed by day then ad set id.
  if (result.offline) {
    for (const [day, perAdset] of Object.entries(offline.byDay || {})) {
      for (const [id, n] of Object.entries(perAdset)) {
        const s = (stats[id] ||= { today: cell(), yesterday: cell(), last7: cell() });
        if (day === today) s.today.results += n;
        else if (day >= since && day <= yesterday) {
          s.last7.results += n;
          if (day === yesterday) s.yesterday.results += n;
        }
      }
    }
  }

  const out = Object.entries(stats)
    .filter(([id, s]) => byId[id] && (s.last7.spend > 0 || s.today.spend > 0 || statusOf(byId[id]) === "ACTIVE"))
    .map(([id, s]) => {
      const a = byId[id];
      for (const b of [s.today, s.yesterday, s.last7]) for (const k of Object.keys(b)) b[k] = round(b[k]);
      const cost = s.last7.results ? round(s.last7.spend / s.last7.results) : null;
      return {
        id,
        name: a.name,
        campaign: a.campaign ? a.campaign.name : "",
        status: statusOf(a),
        budget: a.daily_budget ? Number(a.daily_budget) / 100 : null,
        optimization: a.optimization_goal,
        resultName: result.name,
        today: s.today,
        yesterday: s.yesterday,
        last7: { ...s.last7, costPerResult: cost },
        tier: tierOf(cost, s.last7.spend),
      };
    })
    .sort((x, y) => y.last7.spend - x.last7.spend);

  // What's working: the cheapest results over the last 30 days (min $40 spend, 3 results), with links to the
  // creative (Meta's shareable preview) and the landing page.
  const since30 = dayInTz(tz, -30);
  const adRows = await graphAll(`${account}/insights`, { level: "ad", fields: "ad_id,ad_name,campaign_name,spend,actions,inline_link_click_ctr",
    time_range: { since: since30, until: yesterday }, limit: 500 }, { token });
  const cands = adRows.map((r) => ({ id: r.ad_id, name: r.ad_name, campaign: r.campaign_name, spend: round(Number(r.spend)),
    ctr: round(Number(r.inline_link_click_ctr || 0)), leads: actionCount(r.actions, result.offline ? "lead" : result.metaAction) }))
    .filter((r) => r.spend >= 40 && r.leads >= 3)
    .map((r) => ({ ...r, costPerLead: round(r.spend / r.leads) }))
    .sort((a, b) => a.costPerLead - b.costPerLead).slice(0, 8);
  const winners = [];
  for (const w of cands) {
    const ad = await graph(w.id, { fields: "effective_status,preview_shareable_link,creative{thumbnail_url,image_url,object_story_spec,asset_feed_spec}" }, { token }).catch(() => ({}));
    const c = ad.creative || {}, o = c.object_story_spec || {};
    const page = o.link_data?.link || o.video_data?.call_to_action?.value?.link || (c.asset_feed_spec?.link_urls || [])[0]?.website_url || null;
    winners.push({ ...w, live: ad.effective_status === "ACTIVE", preview: ad.preview_shareable_link || null,
      image: c.image_url || c.thumbnail_url || null, page: page ? page.split("?")[0] : null });
  }

  // Revenue is reported by the business (Stripe / CRM) in copilot/revenue.json; Meta adds the spend for the same dates.
  let revenue = readJson(path.join(dir, "revenue.json"), null);
  if (revenue && revenue.since && revenue.until) {
    try {
      const r = await graph(`${account}/insights`, { fields: "spend", time_range: JSON.stringify({ since: revenue.since, until: revenue.until }) }, { token });
      revenue.adSpend = round(Number((r.data[0] || {}).spend || 0));
    } catch { /* keep the reported numbers */ }
  }

  const armed = adsets.filter((a) => statusOf(a) === "ARMED");
  const sum = (xs) => round(xs.reduce((t, x) => t + x, 0));
  const data = {
    generatedAt: new Date().toISOString(),
    business: { name: (config.business || {}).name || acct.name, owner: (config.business || {}).owner || "the owner" },
    resultName: result.name,
    timezone: tz,
    currency: acct.currency,
    today,
    yesterday,
    window: { since, until: yesterday },
    account: {
      todaySpend: round(daily[today] || 0),
      yesterdaySpend: round(daily[yesterday] || 0),
      last7Spend: sum(Object.entries(daily).filter(([d]) => d < today).map(([, v]) => v)),
      liveDailyBudget: sum(adsets.filter((a) => statusOf(a) === "ACTIVE").map((a) => Number(a.daily_budget || 0) / 100)),
      armedCount: armed.length,
      // A paused campaign with its own budget (CBO) spends that budget once; otherwise its armed ad sets' budgets add up.
      armedDailyBudget: sum(Object.values(armed.reduce((byCamp, a) => {
        const c = a.campaign || {};
        const k = c.id || a.id;
        byCamp[k] = c.daily_budget ? Number(c.daily_budget) / 100 : (byCamp[k] || 0) + Number(a.daily_budget || 0) / 100;
        return byCamp;
      }, {}))),
    },
    daily: Object.entries(daily).sort().map(([day, spend]) => ({ day, spend: round(spend), partial: day === today })),
    adsets: out,
    winners,
    revenue,
    resultsNote: result.offline ? offline.note || "Results come from the business's own records (client/results.json)." : "",
    plan,
  };

  const json = JSON.stringify(data, null, 2);
  if (process.argv[2]) {
    fs.writeFileSync(process.argv[2], json + "\n");
    console.error(`Wrote ${process.argv[2]}: ${out.length} ad sets, $${data.account.todaySpend} today, ${armed.length} armed`);
  } else {
    process.stdout.write(json + "\n");
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
