# The setup prompt

Paste everything between the lines into a new Claude Code session on your copy of this repo (`START-HERE.md`, step 4).

---

Hi Claude. This repo runs my Facebook + Instagram ads. Please set me up, one step at a time and in plain language. I'm not
very technical. Keep your messages short.

1. Read CLAUDE.md, START-HERE.md, SETUP.md, client/config.json, client/business/, .claude/skills/meta-ads-operator/SKILL.md (if it is missing, walk me through installing it first) and
   skills/ghl-ads/SKILL.md.
2. Ask me which way we run ads: GoHighLevel Ad Manager or Meta direct. Record it in client/config.json → adsPath.
   - GHL: ask for my GHL Private Integration Token with the secure credential form (host services.leadconnectorhq.com,
     Bearer), never in chat. Then ask for my location ID, save it in client/config.json → ghl.locationId and run
     `node ops/ghl/check.js`. Tell me in plain words what's connected and fix anything it flags with me.
   - Meta: run `./scripts/meta-kit.sh doctor` and `cd ops && node copilot-snapshot.js`. If ACCESS_TOKEN or AD_ACCOUNT_ID
     is missing, walk me through SETUP.md steps 1-3 one click at a time.
   Save the ad account, Page and pixel IDs in client/config.json → meta.
3. Interview me, a few questions at a time, to fill client/config.json and client/business/: business, offer, who buys,
   my name and story, what one customer is worth, my close rate, my daily budget and who follows up with leads.
   Show me the economics and tiers you set.
4. Tracking: check my site has my pixel on every page and fires one Lead event only on the thank-you page. If not, give
   me the exact text to paste into my site builder. Check the pixel is shared with the ad account.
5. Creatives: read my landing page, then build 3-5 ads with ops/newads (my headshot is in client/assets/photos/headshot.png)
   in proven styles. Run the 4 creative checks and send them to me.
6. Build the first campaign as a paused draft (GHL: `node ops/ghl/build.js <draft>`; Meta: `node ops/launch-ad.js <draft> --dry`)
   and show me. Publish only after I say yes in my own words, then confirm it on Facebook and log it in reports/.
7. Set up the daily + hourly routines from docs/ROUTINES.md and publish my Ads HQ page.

Rules: don't spend money, launch anything or message my customers without my yes. Everything new starts paused.

---
