# Setup: the detailed reference

> The short version is **[START-HERE.md](START-HERE.md)** (5 steps). This file has the click-by-click detail for the
> Meta-direct path (steps 1-3) and what Claude does after. GoHighLevel users: START-HERE step 3A replaces steps 1-3 here.

About 1-2 hours of your time, plus waiting on Meta. Do the steps in order. Stuck? Open a Claude Code session on this repo
and say "help me with setup step N". Claude will walk you through it.

---

## What you need before you start

| You need | Why |
|---|---|
| A **Meta Business Manager** (business.facebook.com) where you're an admin | Where your ad account, pixel and Page live |
| Your **ad account**, with a payment method | Where the ads run |
| Your own **pixel** (dataset) on your website | So Meta knows who became a lead or customer. It must be yours only: never share a pixel with other sites |
| Your **Facebook Page** and **Instagram account**, linked to the ad account | Ads run from these |
| A **verified domain** (Business settings → Brand safety → Domains) | Required to track conversions on your site |
| A **Claude** plan with Claude Code on the web (claude.ai/code) | Claude runs your ads from here |
| A **GitHub** account with this repo | Claude reads and saves its work here |

---

## Step 1. Make a Meta app (5 minutes)
1. Go to developers.facebook.com → **My Apps** → **Create App** → type **Business** → name it "<Your business> Ads Agent" →
   pick your Business Manager.
2. In the app, add the **Marketing API** product.
3. Top of the page: switch **App Mode** to **Live** (you may need to add a privacy policy URL, any page on your site works).
   Live mode matters: in Development mode Claude can't create ads.

## Step 2. Make a system user and its token (10 minutes)
1. business.facebook.com → **Settings** → **Users** → **System users** → **Add** → name "Claude Ads" → role **Admin**.
2. Click it → **Assign assets**: your **ad account** (Full control / Manage campaigns), your **pixel/dataset** (Manage),
   your **Facebook Page** (Advertise / Manage).
3. **Generate new token** → pick the app from Step 1 → expiration **Never** → tick:
   `ads_management`, `ads_read`, `business_management`, `pages_read_engagement`, `pages_manage_ads`, `pages_show_list`.
4. Copy the token. Keep it secret: never paste it in a chat, email, file or GitHub. You'll paste it in one place only (Step 3).

## Step 3. Connect Claude to this repo and to Meta (10 minutes)
1. claude.ai/code → connect GitHub if asked → make sure this repo is listed.
2. Open the **environment** settings (the environment menu when you start a session → **Add environment** or edit one) and set:
   - Network access: **Limited**, plus allow `graph.facebook.com` (or Unrestricted, if you prefer).
   - Environment variables:
     - `ACCESS_TOKEN` = the token from Step 2
     - `AD_ACCOUNT_ID` = your ad account number (Ads Manager URL: `act=1234...`; the `act_` part is optional)
     - `PAGE_ID` = your Facebook Page ID (Page → About → Page transparency)
     - `IG_USER_ID` = your Instagram account ID (optional)
     - `PIXEL_ID` = your pixel/dataset ID (Events Manager)
3. Start a **new session** with this repo on that environment (new settings only reach sessions started after you save).
4. Ask Claude: **"Check the Meta connection."** It runs `./scripts/meta-kit.sh doctor` and should report `ok_non_mock`, then
   lists your ad sets.

## Step 4. Tell Claude about your business (30-45 minutes)
Ask Claude: **"Start setup step 4."** It interviews you and fills in:
- `client/config.json`: business name, owner, your stack, Meta IDs, **what counts as a result** (lead, booked call, purchase,
  text-in...), **what one customer is worth**, your **breakeven and target cost per result**, budget caps, offers and pages.
- `client/business/`: identity, brand voice, ideal client, offers, competitors, design. Paste in what you have; Claude writes it up.

The most important answers: **what a result is**, **where the real count lives** (Stripe, CRM, calendar) and **who reports
it**. Without them, Claude can only judge the ads on Meta's pixel numbers.

## Step 5. Upload your creative material (15 minutes)
Put files in `client/assets/` (or a Google Drive folder you share with Claude's Drive connector):
- `photos/`: headshot, 20+ natural photos/reaction shots of the face of the brand, cut-outs with no background
- `logos/`: transparent PNGs
- `videos/`: past ads, testimonials, talking-to-camera clips (big videos are better in Drive)
- `winning-ads/`: screenshots of ads that worked, with their cost per result if you know it
- `testimonials/`: reviews and results you're OK using in ads

## Step 6. First read of your account (Claude does this, ~20 minutes)
Ask: **"Do the first account read."** Claude:
1. Pulls 12 months of your ads and ranks what worked (creative, headline, offer, page, audience).
2. Researches 3-5 competitors in the Meta Ad Library (`docs/research/`).
3. Writes `docs/context/<date>.md`: what's live, what worked, broken tracking, and the first 3 moves it recommends.
4. Publishes your **Ads HQ page** (live numbers, approvals, to-dos, winners, Levers) and gives you the link.

## Step 7. Fix tracking before spending more
Claude checks each landing page fires its event once, that UTMs/fbclid reach your CRM, and how results get reported.
Anything broken becomes a to-do on the HQ page. Fix those first.

## Step 8. Turn on the daily and hourly routines (10 minutes)
1. Keep one session open for your ads (rename it "<Business> ads runner"). Routines fire into this session, so it keeps the repo.
2. Ask Claude: **"Set up the routines from docs/ROUTINES.md."** It creates:
   - **Hourly**: refresh the HQ page + spend safety check (stays quiet unless something needs you).
   - **Daily** (pick a time): check the account, fix what's 0-7 risk, write the report, message you a few bullets.
3. On claude.ai → Routines, add the connectors you use (Google Drive, your CRM, analytics) to both routines,
   or those steps get skipped.

## Step 9. Your rules
Tell Claude, in your own words, and it records them in `CLAUDE.md` → "Decisions":
- Your daily budget cap, and whether Claude can run its own `[Claude]` test campaigns (and their cap).
- Whether new creatives need your OK or go live 24 hours after Claude sends them.
- Anything it must never do.

You're live. From here: read the daily message, answer the 8+ questions, and check the HQ page when you want detail.

---

## Safety summary
- Claude never raises a budget, turns things off, starts new spend or messages your customers without your yes.
- Everything new is created paused. Every change is checked in Meta and logged in `reports/`.
- Your token lives only in the environment settings. To cut Claude off at any time, delete the system user's token in
  Business settings.
