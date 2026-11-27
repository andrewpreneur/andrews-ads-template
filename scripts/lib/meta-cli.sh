#!/usr/bin/env bash

mk_snapshot_json() {
  local label="$1"
  local json_payload="$2"
  local output_dir ts out_file

  output_dir="$(mk_readonly_output_dir)"
  mkdir -p "$output_dir"
  ts="$(date -u +"%Y-%m-%dT%H%M%SZ")"
  out_file="${output_dir}/${ts}-${label}.json"

  printf '%s\n' "$json_payload" > "$out_file"
  printf '%s\n' "$out_file"
}

mk_meta_base_cmd() {
  # Prefer an installed `meta` binary. Fall back to uvx so the kit can inspect/run
  # the official PyPI package without forcing a global install.
  if command -v meta >/dev/null 2>&1; then
    META_BASE_CMD=(meta)
  elif command -v uvx >/dev/null 2>&1; then
    META_BASE_CMD=(uvx --python 3.12 --from meta-ads meta)
  else
    echo "ERROR: Meta CLI not installed and uvx is unavailable. Install with: pip install meta-ads" >&2
    return 1
  fi
}

mk_meta_cli_command_for() {
  local op="$1"

  # Official Ads CLI uses singular resources and noun-verb pattern:
  # meta ads <resource> <action> [options]
  # Docs: /documentation/ads-commerce/ads-ai-connectors/ads-cli/command-reference
  case "$op" in
    campaigns_list) META_CMD=(meta ads campaign list) ;;
    adsets_list) META_CMD=(meta ads adset list) ;;
    ads_list) META_CMD=(meta ads ad list) ;;
    insights_campaign_last_7d) META_CMD=(meta ads insights get --date-preset last_7d --fields spend,impressions,clicks,ctr,cpc,reach) ;;
    insights_ad_last_7d) META_CMD=(meta ads insights get --date-preset last_7d --fields spend,impressions,clicks,ctr,cpc,reach,frequency) ;;
    insights_ad_daily_last_7d) META_CMD=(meta ads insights get --date-preset last_7d --time-increment daily --fields spend,impressions,clicks,ctr,cpc,reach,frequency) ;;
    *)
      echo "ERROR: unknown operation mapping: $op" >&2
      return 1
      ;;
  esac
}

mk_meta_cli_doctor() {
  local mode output
  mode="$(mk_mode)"
  output="$(mk_output_format)"

  echo "meta-kit doctor"
  echo "mode=$mode output=$output"

  if command -v meta >/dev/null 2>&1; then
    echo "meta_binary=found"
    if meta --help >/dev/null 2>&1; then
      echo "meta_help=ok"
    else
      echo "meta_help=failed"
    fi
    if meta ads --help >/dev/null 2>&1; then
      echo "meta_ads_help=ok"
    else
      echo "meta_ads_help=failed"
    fi
    if meta ads campaign list --help >/dev/null 2>&1; then
      echo "meta_campaign_list_help=ok"
    else
      echo "meta_campaign_list_help=failed"
    fi
    if meta ads insights get --help >/dev/null 2>&1; then
      echo "meta_insights_get_help=ok"
    else
      echo "meta_insights_get_help=failed"
    fi
    if meta ads adaccount list --help >/dev/null 2>&1; then
      echo "meta_adaccount_list_help=ok"
    else
      echo "meta_adaccount_list_help=failed"
    fi
  else
    echo "meta_binary=missing"
    echo "note=official Meta Ads CLI not found in PATH"
    if command -v uvx >/dev/null 2>&1; then
      echo "uvx=found"
      if uvx --python 3.12 --from meta-ads meta --help >/dev/null 2>&1; then
        echo "uvx_meta_help=ok"
      else
        echo "uvx_meta_help=failed"
      fi
      if uvx --python 3.12 --from meta-ads meta ads campaign list --help >/dev/null 2>&1; then
        echo "uvx_meta_campaign_list_help=ok"
      else
        echo "uvx_meta_campaign_list_help=failed"
      fi
      if uvx --python 3.12 --from meta-ads meta ads insights get --help >/dev/null 2>&1; then
        echo "uvx_meta_insights_get_help=ok"
      else
        echo "uvx_meta_insights_get_help=failed"
      fi
      if uvx --python 3.12 --from meta-ads meta ads adaccount list --help >/dev/null 2>&1; then
        echo "uvx_meta_adaccount_list_help=ok"
      else
        echo "uvx_meta_adaccount_list_help=failed"
      fi
    else
      echo "uvx=missing"
    fi
  fi

  if command -v jq >/dev/null 2>&1; then
    echo "jq=found"
  else
    echo "jq=missing"
  fi

  if [[ -n "${AD_ACCOUNT_ID:-${META_AD_ACCOUNT:-}}" ]]; then
    echo "ad_account_id=$(mk_normalize_account "${AD_ACCOUNT_ID:-$META_AD_ACCOUNT}")"
  else
    echo "ad_account_id=missing"
  fi

  if [[ -n "${ACCESS_TOKEN:-${META_SYSTEM_USER_ACCESS_TOKEN:-}}" ]]; then
    echo "access_token=present"
  else
    echo "access_token=missing"
  fi

  if [[ "$mode" == "mock" ]]; then
    echo "doctor_status=ok_mock_mode"
  else
    echo "doctor_status=ok_non_mock"
  fi
}

mk_meta_cli_read_json() {
  local op="$1"
  local label="$2"
  local mode json account

  mode="$(mk_mode)"
  account="$(mk_normalize_account "${AD_ACCOUNT_ID:-${META_AD_ACCOUNT:-}}")"

  if [[ "$mode" == "mock" ]]; then
    case "$op" in
      campaigns_list) json="$(mk_fixture_json campaigns.list.json)" ;;
      adsets_list) json="$(mk_fixture_json adsets.list.json)" ;;
      ads_list) json="$(mk_fixture_json ads.list.json)" ;;
      insights_campaign_last_7d|insights_ad_last_7d|insights_ad_daily_last_7d)
        json="$(mk_fixture_json insights.last_7d.json)"
        ;;
      *)
        echo "ERROR: no mock fixture mapping for op '$op'" >&2
        return 1
        ;;
    esac
    mk_snapshot_json "$label" "$json" >/dev/null
    printf '%s\n' "$json"
    return 0
  fi

  mk_meta_base_cmd || return 1

  mk_meta_cli_command_for "$op"

  if [[ -z "$account" ]]; then
    echo "ERROR: META_AD_ACCOUNT is required outside mock mode." >&2
    return 1
  fi

  export AD_ACCOUNT_ID="$account"
  case "$op" in
    campaigns_list) json="$(mk_meta_cli_live_campaigns)" || return 1 ;;
    insights_*) json="$(mk_meta_cli_live_insights)" || return 1 ;;
    *) json="$(mk_meta_cli_run "${META_CMD[@]:1}")" || return 1 ;;
  esac
  mk_snapshot_json "$label" "$json" >/dev/null
  printf '%s\n' "$json"
}

# Run one read through the official CLI as JSON. On failure, show Meta's error
# instead of returning an empty result the reports would print as blank sections.
mk_meta_cli_run() {
  local err out
  err="$(mktemp)"
  if ! out="$("${META_BASE_CMD[@]}" --output json --no-input "$@" 2>"$err")"; then
    echo "ERROR: meta $* failed:" >&2
    grep -v 'UV_NATIVE_TLS' "$err" >&2 || true
    rm -f "$err"
    return 1
  fi
  rm -f "$err"
  printf '%s\n' "$out"
}

# Live campaign list, wrapped as {data: [...]} like the mock fixture.
mk_meta_cli_live_campaigns() {
  local raw
  raw="$(mk_meta_cli_run ads campaign list --limit 1000 \
    --fields id,name,status,effective_status,objective,daily_budget)" || return 1
  jq '{data: .}' <<<"$raw"
}

# Live insights in the mock fixture's shape (account_summary, campaign_insights,
# ad_insights, ad_daily, today_campaign_spend). The CLI's insights command has no
# --level, so per-campaign and per-ad numbers come from list --fields expansions:
# three calls in total. Cached per run so the daily check doesn't repeat them.
mk_meta_cli_live_insights() {
  local preset="${PRESET:-last_7d}"
  local cache="/dev/null"
  local metrics="spend,impressions,clicks,ctr,cpc,frequency"
  local tmp

  if [[ ! "$preset" =~ ^[a-z0-9_]+$ ]]; then
    echo "ERROR: invalid preset '$preset'" >&2
    return 1
  fi
  if [[ -n "${MK_CACHE_DIR:-}" ]]; then
    cache="${MK_CACHE_DIR}/insights-${preset}.json"
    if [[ -s "$cache" ]]; then
      cat "$cache"
      return 0
    fi
  fi

  tmp="$(mktemp -d)"
  # Full ad lists are too big for jq --argjson, so the raw pulls go through files.
  mk_meta_cli_run ads campaign list --limit 1000 \
    --fields "id,name,status,daily_budget,insights.date_preset(${preset}){${metrics}},insights.date_preset(today).as(today){spend}" >"$tmp/campaigns.json" || { rm -rf "$tmp"; return 1; }
  mk_meta_cli_run ads adset list --limit 1000 \
    --fields id,status,daily_budget,campaign_id >"$tmp/adsets.json" || { rm -rf "$tmp"; return 1; }
  mk_meta_cli_run ads ad list --limit 1000 \
    --fields "id,name,effective_status,campaign{name},insights.date_preset(${preset}){${metrics}},insights.date_preset(${preset}).time_increment(1).as(daily){ctr,cpc,frequency}" >"$tmp/ads.json" || { rm -rf "$tmp"; return 1; }

  jq -n \
    --arg account "$AD_ACCOUNT_ID" \
    --arg currency "${META_KIT_CURRENCY:-USD}" \
    --slurpfile campaigns_f "$tmp/campaigns.json" \
    --slurpfile adsets_f "$tmp/adsets.json" \
    --slurpfile ads_f "$tmp/ads.json" '
    $campaigns_f[0] as $campaigns | $adsets_f[0] as $adsets | $ads_f[0] as $ads |
    def money: (. * 100 | round) / 100;
    # Meta omits a metric with no data (no clicks means no cpc); report it as 0, rounded to cents.
    def tidy: reduce ("spend","ctr","cpc","frequency") as $k (.; .[$k] = (.[$k] // "0" | tonumber | money | tostring));
    def row: (.insights.data[0] // null | if . then tidy else . end);
    # Budgets come back in cents. A campaign with no budget of its own (ABO)
    # spends its ACTIVE ad sets budgets.
    def budget($c): if $c.daily_budget then ($c.daily_budget|tonumber)
      else [$adsets[] | select(.campaign_id == $c.id and .status == "ACTIVE") | (.daily_budget // "0" | tonumber)] | add // 0 end;
    ([$campaigns[] | select(.status == "ACTIVE") | .id]) as $live_ids
    # Armed = ad set ACTIVE under a paused campaign; it spends the moment the campaign resumes.
    | [$adsets[] | select(.status == "ACTIVE" and ((.campaign_id) as $id | $live_ids | index($id) | not))] as $armed
    | {
      account_summary: {
        account_id: $account,
        currency: $currency,
        spend_7d: ([$campaigns[] | row | select(.) | .spend | tonumber] | add // 0 | money),
        spend_today: ([$campaigns[] | .today.data[0].spend // empty | tonumber] | add // 0 | money),
        daily_budget_target: ([$campaigns[] | select(.status == "ACTIVE") | budget(.)] | add // 0 | . / 100 | money),
        active_campaigns: ($live_ids | length),
        active_ads: ([$ads[] | select(.effective_status == "ACTIVE")] | length),
        armed_adsets: ($armed | length),
        armed_daily_budget: ([$armed[] | (.daily_budget // "0" | tonumber)] | add // 0 | . / 100 | money)
      },
      campaign_insights: [$campaigns[] | row as $r | select($r) | $r + {campaign_id: .id, campaign_name: .name}],
      ad_insights: [$ads[] | row as $r | select($r) | $r + {ad_id: .id, ad_name: .name, campaign_name: .campaign.name, effective_status}],
      ad_daily: [$ads[] | {id, name} as $a | (.daily.data // [])[] | tidy + {ad_id: $a.id, ad_name: $a.name}],
      today_campaign_spend: [$campaigns[] | select(.today.data[0].spend) | {campaign_id: .id, campaign_name: .name, spend_today: .today.data[0].spend}]
    }' | tee "$cache"
  rm -rf "$tmp"
}

mk_meta_cli_prepare_mutation() {
  local action="$1"
  local payload="$2"
  local desired_status="$3"
  local account

  account="$(mk_normalize_account "${AD_ACCOUNT_ID:-${META_AD_ACCOUNT:-}}")"

  desired_status="$(mk_enforce_paused_only "$desired_status")" || return 1

  local command_preview
  command_preview="AD_ACCOUNT_ID=${account:-<missing>} meta --no-input ads <resource> $action --status $desired_status --payload $payload"
  mk_write_dry_run_artifact "$action" "$account" "$command_preview" "$payload"
}
