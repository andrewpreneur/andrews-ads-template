# Ads Agent template (Meta + GoHighLevel)

Your own Facebook + Instagram ads, run by Claude. Connect this repo to Claude Code, connect your Meta ad account, tell it
about your business, and it will:

- **Check your ads every day** and judge each one on what a real result costs you (not likes or clicks).
- **Fix the small things itself**: pause a losing ad, rotate in a new one, build new creatives in styles that already work.
- **Ask you before anything big**: budget increases, turning things off, new spend, anything sent to your customers.
- **Show you everything on one page** (Ads HQ): spend, results, what's working with links to the real ads, what's waiting on you.
- **Send you a short daily message**: what needs you, what changed, one line of numbers.

## Get started
Follow **[START-HERE.md](START-HERE.md)**: 5 steps from zero to ads running, through GoHighLevel or straight through Meta.

## What's inside
| Folder | What it is |
|---|---|
| `CLAUDE.md` | The agent's rules: risk scale, approvals, creative checks, daily routine |
| `client/` | Your business: config (IDs, results, economics, budget caps), Second Brain docs, photos/logos/videos |
| `skills/` | `ghl-ads` (run ads through GoHighLevel's Ad Manager) + helper skills. The Meta Ads Mastery playbook is a paid add-on you install into `.claude/skills/` (see START-HERE) |
| `scripts/`, `run.sh` | Read-only Meta reports: daily check, bleeders, winners, fatigue, pacing |
| `ops/` | Scripts for the HQ page, launching ads (Meta: `launch-ad.js`; GHL: `ops/ghl/`), creative rendering |
| `docs/` | Meta traps to avoid, competitor research, account context, routine prompts |
| `reports/` | Daily reports and a log of every change the agent makes |

## Safety
- Everything new is created **paused**. Every change is checked in Meta and logged.
- Tokens (Meta or GHL) live only in your Claude environment settings, never in this repo.
- Revoke access any time by deleting the system user's token in Meta Business settings.

Built on the open-source Meta Ads CLI kit by Matt Berman (MIT, see `LICENSE`).
