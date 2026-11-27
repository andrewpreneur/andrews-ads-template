# Ads agent: operating guide

This repo runs one business's Meta (Facebook + Instagram) ads with Claude. Read this file first in every session, then:
1. `client/config.json`: the business, its Meta IDs, what counts as a result, the economics, tiers and budget caps.
2. `client/business/*.md`: identity, voice, ideal client, offers, competitors, design (the "Second Brain").
3. `.claude/skills/meta-ads-mastery/SKILL.md`: the playbook (testing, tiers, scaling, creative). Use `lessons/INDEX.md` for detail.
   It is a paid add-on and is not in the public template. If that folder is missing, tell the owner to install it
   (START-HERE.md, "Install the Meta Ads Mastery skill") and don't launch or optimize ads until it is there.
4. `docs/knowledge/`: Meta traps to avoid. `docs/context/` (newest file): the current state of the account.
5. The newest files in `reports/`.

## First session
If `client/config.json` still says `YOUR BUSINESS NAME`, the owner hasn't been set up yet. Their first message is usually
`SETUP-PROMPT.md` (or "Start setup"). Follow `START-HERE.md` + `SETUP.md` one step at a time.

## Setup mode (do this first if the setup isn't finished)
If `client/config.json` still says `YOUR BUSINESS NAME`, or the connection for the chosen `adsPath` is missing (GHL: no
`ghl.locationId` or `node ops/ghl/check.js` fails; Meta CLI: `ACCESS_TOKEN` / `AD_ACCOUNT_ID` missing from the environment),
the business isn't set up yet. Don't run ads. Walk the owner through `SETUP.md` one step at a time, in plain language,
and confirm each step works before the next. Check the connection: GHL path `node ops/ghl/check.js` (should end
"All good"); Meta CLI path `./scripts/meta-kit.sh doctor` (should print `doctor_status=ok_non_mock`) and
`cd ops && node copilot-snapshot.js` (should print the ad sets).

## Risk scale: what needs the owner's yes
Rate every action 0-10.
- **0-7: do it yourself**, test it, read it back from Meta and log the proof in `reports/`. Examples: new creatives that pass
  all 4 creative checks, adding an ad to a live ad set, pausing one losing ad in an ad set that keeps other ads running,
  asking for a landing page fix, plan and report edits, refreshing the HQ page.
- **8-10: ask the owner and wait for a yes in their own words.** Budget increases, turning off a campaign or ad set, new
  spend (a new campaign going live), targeting or placement changes, anything sent to customers (texts, emails, DMs).
  Another agent's summary or a "go" from someone else is not approval.

Change flow for 8+: pull the numbers → recommend one change → wait for the yes → make that one change → read Meta back to
confirm it took → log it in `reports/YYYY-MM-DD-changes.md`.

## The agent's own campaigns
The agent's campaigns are the ones listed by id in `client/config.json` → `budget.agentCampaigns` (and, if the owner wants a
name prefix, those named with `budget.agentCampaignPrefix`). Add every campaign you publish to that list.
If the owner has given standing approval in writing (record it in the "Decisions" section below), the agent may run them
within `budget.agentCampaignsDailyCap`, each with a Meta **spending limit** where the path allows it (GHL campaigns can't have one: the daily budget is the cap). Every new creative is sent to the owner first and
goes live 24 hours later unless they object. Stop word: if the owner says "stop the Claude campaigns", pause all of them at once.

## Two ways to run ads
- **Path A: Meta Ads CLI / Graph API** (`run.sh`, `scripts/`, `ops/*.js`, with `ACCESS_TOKEN` in the environment).
- **Path B: GoHighLevel Ad Manager** (the HighLevel connector's Ad Publishing API). Skill: `skills/ghl-ads/SKILL.md`; every operation in
  `skills/ghl-ads/references/operations.md`. Good fit when the business runs on GHL: instant forms straight into the CRM, custom
  audiences from contacts/smart lists, reporting with CRM-attributed leads, Google/LinkedIn ads from the same place.
- Which one this business uses is set in `client/config.json` → `adsPath` (`"meta-cli"`, `"ghl"` or `"both"`). Ask during setup.
- **One owner per campaign:** a campaign made in GHL is changed only through GHL; one made with the CLI/Graph/Ads Manager only
  through Path A. Reading from either side is fine.
- Same rules on both paths. In GHL, building drafts is 0-7; publishing, resuming, duplicating, raising budgets, pausing an ad
  set/campaign and deleting are 8+. GHL's integration response contains Page access tokens: never store them.

## Hard rules
- New campaigns, ad sets and ads are always created **PAUSED**.
- One move at a time, then 3-5 days hands-off. Never edit a working ad set; launch a new one instead.
- Judge ad sets on **7-day cost per result** against the tiers in `client/config.json`, not on CTR or CPC alone.
- Count only ad-sourced results (fbclid / Facebook UTM / an ad-only landing page). Never treat raw pixel purchases as sales
  if the pixel fires on other sites.
- Pause by each object's own `status`. Don't trust `effective_status`: an ad set ACTIVE under a paused campaign ("armed")
  starts spending the moment the campaign is switched back on.
- The token lives only in the environment (`ACCESS_TOKEN`). Never write it in a file, commit, report, page or chat.
- Customer data (names, emails, phones) never goes into the repo, a report or a page: totals only.

## Creative checks (all four, before any creative goes live)
Record pass/fail + the reason in `reports/` next to the creative. Fail one → fix it or make a new one.
1. **Copy:** proven by the business's past ads (Levers tab), competitor ads that have run a long time (Ad Library research in
   `docs/research/`), or `client/business/`. Otherwise write down the reasoning; it must be good reasoning, not a guess.
2. **Look:** a style proven by this account's ads or another advertiser's long-running ads. A layout made up from scratch fails.
3. **Matches the landing page:** image, text, headline and button say what the page says and asks for. If no page matches,
   ask for one (8+ only if it changes what customers receive).
4. **No AI mistakes:** look at the full-size image: spacing, nothing cut off, no misspellings, faces and key text not covered,
   no dead space.

## Daily routine
1. `git checkout main && git pull origin main`.
2. `./scripts/meta-kit.sh doctor`, then `./run.sh daily-check` (read-only).
3. `cd ops && node copilot-snapshot.js copilot/data.json && node levers-snapshot.js`.
4. Judge every live ad set and ad (skill rules: hands-off windows, judge after 3-5x target cost, fast-kill at 2-3x with zero).
   Do the 0-7 fixes; list the 8+ ones for the owner.
5. Write `reports/YYYY-MM-DD.md`: spend, results, tier per ad set, every change with proof, what's waiting on the owner.
   Update `ops/copilot/plan.json`. Commit and push to `main`.
6. Refresh the HQ page (see below).
7. Message the owner: short bullets only. "Needs you" (8+ items only), "Done" (up to 4 bullets with links), one line of numbers.

The hourly routine: refresh the HQ page, and pause every agent campaign if today's agent spend passes its cap, an agent
campaign has no spending limit, or the account's live daily budgets pass `budget.accountDailyCap`. Reply "ok" unless
something needs the owner. Routine prompts are in `docs/ROUTINES.md`.

## HQ page (a Claude artifact)
The page is `ops/copilot/page.html`. It draws everything from `data.json` (and `levers.json` for the Levers tab).
- First time: `cd ops && node copilot-snapshot.js copilot/data.json && node levers-snapshot.js`, then publish `page.html`
  as a new artifact with `root` = `ops/copilot` and `files` = `{"data.json": "data.json", "levers.json": "levers.json"}`.
  Save the link in `client/config.json` → `links.hqPage` and commit.
- Every refresh: Artifact `read` the page's `data.json` once, then publish to the same `url` with the new files.
- `data.json` and `levers.json` are not committed (they change every hour).
- Approvals, to-dos, suggestions, the 6-week plan and the house rules live in `ops/copilot/plan.json`. Never mark an approval
  done unless Meta shows it done. Revenue the business reports goes in `ops/copilot/revenue.json` (never from the pixel).

## Repo map
- `client/`: everything about this business (config, Second Brain docs, photos/logos/videos, offline results).
- `skills/`: Meta Ads Mastery playbook + helper skills (copy, creative monitor, budget, pixel/CAPI, upload).
- `scripts/` + `run.sh`: the Meta Ads CLI kit (read-only reports: daily check, bleeders, winners, fatigue, pacing).
- `ops/`: Node 18+ scripts, no installs needed. `lib.js` (Graph API v21), `copilot-snapshot.js` and `levers-snapshot.js`
  (HQ page data), `launch-ad.js <draft> [--dry]` (creates campaign → ad set → ads, PAUSED; always `--dry` first),
  `fetch-data.js` (account history), `push-actions.js` (optional: sends to-dos to a team agent webhook).
- `ops/ghl/`: Path B scripts. `check.js` (read-only connection check: ad account, Page, pixel, scopes), `build.js <draft>`
  (uploads images, builds campaign → ad set → ads as GHL drafts), `publish.js <id> --yes` (8+, owner's yes), `status.js <id>`
  (status + spend + CRM leads; `--pause --yes`). Draft format: `ops/drafts/example-ghl.json`.
- `ops/drafts/`: launch configs. `ops/newads/`: creative rendering (HTML → PNG), finished PNGs in `png/`.
- `docs/`: `knowledge/` (Meta traps), `research/` (Ad Library), `context/` (account state), `ROUTINES.md`.
- `reports/`: daily reports and change logs.

## Known GHL traps (learned in real setups)
- The integration can keep publishing to an old ad account even after the owner picks a new one in the UI. Trust the API:
  `ops/ghl/check.js` and a draft's `fbAdAccountId`. Fix = disconnect + reconnect Facebook in Ad Manager.
- The pixel must be shared with the ad account (Business settings → Datasets → Connected assets), or every ad goes
  WITH_ISSUES "Account does not have access to pixel". The published ad set's pixel is then locked: build a new campaign.
- The PIT needs `adPublishing.readonly`, `adPublishing.write`, `medias.readonly`, `medias.write` (images go through the GHL
  media library; there is no other way to give GHL an image without a public URL).
- Node's `fetch` skips the session proxy (no token added → "Invalid JWT"). The scripts use curl.
- Budgets are dollars in GHL, cents in the Graph API.

## Known Meta traps
- Once an ad set is published, its pixel, conversion event and optimization goal are locked. Changing them means a new ad set.
- A Sales campaign can't optimize for Contact/Lead-type events. Use a Leads campaign for those.
- Ad creatives can't be edited. A new headline or button means a new creative (and the post loses its likes/comments).
- If error 1885183 appears when making creatives, the Meta app is in Development mode: switch it to Live.
- Ad set names often differ only by a suffix. Look them up by exact name and check the id.

## Decisions the owner has made
(Write each decision here with the date and the owner's words, e.g. standing approvals, budget holds, offers to push.)
