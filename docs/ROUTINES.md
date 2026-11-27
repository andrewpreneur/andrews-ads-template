# Routine prompts

Two scheduled tasks fire into one standing Claude Code session that has this repo (a task that starts a fresh session
has no repo and fails). Create them on claude.ai → Routines (or ask Claude: "set up the routines from docs/ROUTINES.md"),
and replace `<HQ_PAGE_URL>` with the link in `client/config.json` → `links.hqPage`. Add your connectors (Drive, CRM,
analytics) to both tasks, or those steps are skipped.

## Hourly: HQ refresh + safety check (every hour)
```
Hourly refresh of the Ads HQ page. READ-ONLY except step 2. Keep this run short and quiet.
0. In the repo: git checkout main && git pull -q origin main.
1. cd ops && node copilot-snapshot.js copilot/data.json. If the token is invalid or expired, stop and say so in one plain sentence; don't publish.
2. Safety check on the agent's own campaigns only (name starts with client/config.json budget.agentCampaignPrefix): if today's combined spend on them is over budget.agentCampaignsDailyCap, or any of them has no Meta spending limit, or the account's live daily budgets exceed budget.accountDailyCap, pause every agent campaign by its own status, read it back from Meta, log it in reports/YYYY-MM-DD-changes.md and push to main. Never change any other campaign.
3. Artifact read <HQ_PAGE_URL> path data.json once, then publish with url = that link, file_path = absolute path of ops/copilot/page.html, root = absolute path of ops/copilot, files = {"data.json": "data.json"}.
4. Reply with exactly "ok" unless something needs the owner (token failure, an armed ad set spending, an ad set >50% over budget, or a step-2 pause); then one short line saying what happened and what you did.
```

## Daily: check, self-optimize, report (once a day, e.g. 6:37 AM local)
```
Daily Meta ads check and self-optimization. Follow CLAUDE.md, especially the risk scale: 0-7 do it yourself, test it, read it back from Meta and log proof; 8-10 recommend only and wait for the owner's yes in their own words.
0. git checkout main && git pull origin main.
1. Read CLAUDE.md, client/config.json, client/business/, .claude/skills/meta-ads-operator/SKILL.md, docs/context (newest) and the newest reports/.
2. ./scripts/meta-kit.sh doctor then ./run.sh daily-check. If the token fails, stop and tell the owner in one line how to fix it.
3. cd ops && node copilot-snapshot.js copilot/data.json && node levers-snapshot.js. Judge every live ad set on 7-day cost per result against client/config.json tiers. Armed ad sets = information only.
4. Self-optimize: judge every live ad with the skill's rules (hands-off windows, judge after 3-5x target cost, fast-kill at 2-3x with zero). For a loser: pause that one ad if its ad set keeps other ads running, and rotate in a replacement that passes all 4 creative checks (build it in a proven style, render, look at the full-size PNG, log the checks, create PAUSED, verify, send it to the owner; it goes live 24 h later unless they object). One move per ad set at a time. Log every change in reports/YYYY-MM-DD-changes.md.
5. Write reports/YYYY-MM-DD.md: numbers, tier per ad set, every change with proof, the 8+ items waiting on the owner. Update ops/copilot/plan.json. Commit and push to main.
6. Refresh the HQ page: Artifact read <HQ_PAGE_URL> path data.json once, then publish with url = that link, file_path = absolute path of ops/copilot/page.html, root = absolute path of ops/copilot, files = {"data.json": "data.json", "levers.json": "levers.json"}.
7. Final message to the owner, short bullets only: "Needs you:" (8+ items only, skip if none), "Done:" (up to 4 bullets with links), one line with yesterday's spend and cost per result. Never put the token anywhere.
```
