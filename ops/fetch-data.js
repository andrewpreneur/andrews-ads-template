#!/usr/bin/env node
// Pulls live insights from the Meta Graph API and writes data.js for the dashboard.
// Usage: node fetch-data.js [date_preset]   (default: last_30d — e.g. last_7d, last_90d, this_month)
const fs = require("fs");
const path = require("path");
const { loadEnv, graph, graphAll, leadCount } = require("./lib");

const env = loadEnv();
const token = env.ACCESS_TOKEN;
const account = `act_${env.AD_ACCOUNT_ID}`;
const datePreset = process.argv[2] || "last_30d";

const INSIGHT_FIELDS =
  "spend,inline_link_clicks,ctr,cpc,cpm,impressions,frequency,actions,date_start,date_stop";

// Click-attributed registrations only. complete_registration alone (each signup also
// fires start_trial — counting both double-counts) and 7d_click only (view-through
// credits warm-list impressions for signups the ad never earned; see Aug 19 audit).
function regCount(actions) {
  return (actions || []).filter((a) => a.action_type === "complete_registration")
    .reduce((s, a) => s + Number(a["7d_click"] ?? 0), 0);
}
function regViewCount(actions) {
  return (actions || []).filter((a) => a.action_type === "complete_registration")
    .reduce((s, a) => s + Number(a["1d_view"] ?? 0), 0);
}

function shape(row) {
  const spend = Number(row.spend || 0);
  const leads = leadCount(row.actions);
  const regs = regCount(row.actions);
  return {
    spend,
    linkClicks: Number(row.inline_link_clicks || 0),
    ctr: Number(row.ctr || 0),
    cpc: Number(row.cpc || 0),
    cpm: Number(row.cpm || 0),
    impressions: Number(row.impressions || 0),
    freq: Number(row.frequency || 0),
    leads,
    regs,
    regsView: regViewCount(row.actions),
    costPerReg: regs ? spend / regs : null,
    costPerLead: leads ? spend / leads : null,
  };
}

(async () => {
  console.log(`Fetching ${datePreset} insights for ${account}…`);

  const [adsetRows, adRows, daily, summary, adsetMeta, adMeta] = await Promise.all([
    graphAll(`${account}/insights`, { action_attribution_windows: ["7d_click", "1d_view"], level: "adset", date_preset: datePreset, fields: `adset_id,adset_name,campaign_name,${INSIGHT_FIELDS}` }, { token }),
    graphAll(`${account}/insights`, { action_attribution_windows: ["7d_click", "1d_view"], level: "ad", date_preset: datePreset, fields: `ad_id,ad_name,adset_name,campaign_name,${INSIGHT_FIELDS}` }, { token }),
    graphAll(`${account}/insights`, { date_preset: datePreset, time_increment: 1, fields: "spend,date_start" }, { token }),
    graph(`${account}/insights`, { action_attribution_windows: ["7d_click", "1d_view"], date_preset: datePreset, fields: INSIGHT_FIELDS }, { token }),
    graphAll(`${account}/adsets`, { fields: "id,effective_status" }, { token }),
    graphAll(`${account}/ads`, { fields: "id,effective_status,creative{id}" }, { token }),
  ]);

  const adsetStatus = Object.fromEntries(adsetMeta.map((a) => [a.id, a.effective_status]));
  const adStatus = Object.fromEntries(adMeta.map((a) => [a.id, a.effective_status]));
  const adCreative = Object.fromEntries(adMeta.map((a) => [a.id, a.creative && a.creative.id]));

  const fmtDay = (d) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const data = {
    generatedAt: new Date().toISOString(),
    datePreset,
    dateRange: summary.data[0]
      ? { start: summary.data[0].date_start, stop: summary.data[0].date_stop }
      : null,
    summary: summary.data[0] ? shape(summary.data[0]) : null,
    adsets: adsetRows.map((r) => ({
      id: r.adset_id,
      name: r.adset_name,
      campaign: r.campaign_name,
      status: adsetStatus[r.adset_id] || "UNKNOWN",
      ...shape(r),
    })),
    ads: adRows.map((r) => ({
      id: r.ad_id,
      name: r.ad_name,
      adset: r.adset_name,
      campaign: r.campaign_name,
      status: adStatus[r.ad_id] || "UNKNOWN",
      creativeId: adCreative[r.ad_id] || null,
      ...shape(r),
    })),
    dailySpend: daily.map((d) => ({ date: fmtDay(d.date_start), spend: Number(d.spend || 0) })),
  };

  const out = path.join(__dirname, "data.js");
  fs.writeFileSync(out, "window.DASH = " + JSON.stringify(data, null, 2) + ";\n");
  console.log(
    `✔ Wrote ${out}\n  ${data.adsets.length} ad sets, ${data.ads.length} ads, $${(
      data.summary?.spend || 0
    ).toFixed(2)} total spend (${data.dateRange?.start} → ${data.dateRange?.stop})`
  );
  console.log("  Open meta-dashboard.html to view.");
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
