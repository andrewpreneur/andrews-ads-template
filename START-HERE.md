# Start here: from zero to ads running in 5 steps

About 1 hour of your time. Claude does the rest. Pick **one** way to run ads before you start:

| | **A. GoHighLevel (recommended if you use GHL)** | **B. Meta direct** |
|---|---|---|
| Ads are built and published in | GHL Ad Manager (your sub-account) | Meta, through its API |
| You'll need | GHL sub-account + a Facebook ad account | Meta Business Manager admin access |
| Leads land in | your GHL CRM, and reports count real CRM leads | the pixel only (CRM matching is extra work) |

---

## Step 1. Copy the template into your own repo (2 minutes)
1. Open **https://github.com/andrewpreneur/andrews-ads-template**.
2. Click the green **Use this template** button, then **Create a new repository**.
3. Owner: your GitHub account. Name: `<business>-ads` (for example `acme-roofing-ads`). Pick **Private**, because this copy
   will hold the business's numbers. Click **Create repository**.

You don't need to clone anything to your computer. Claude Code on the web clones it for you in Step 2.
(Prefer working locally? Run `git clone https://github.com/<you>/<business>-ads.git`, then `cd <business>-ads` and `claude`.)

## Step 2. Connect GitHub and make the Claude Code environment (5 minutes)
1. **Connect GitHub to Claude (first time only):** go to **https://claude.ai/connect-github**, sign in, and install the
   **Claude GitHub App** on the new repo (or on all repos).
2. **Make the environment:** go to **https://claude.ai/code**. Click the environment menu (next to the repo picker), then
   **Add environment**. Name it `<Business> ads`.
3. **Network access:** pick **Limited**, keep **Allow package managers** ticked, and add these under **Allowed domains**:
   - the business's website, for example `acmeroofing.com` and `www.acmeroofing.com` (so Claude can check the pixel)
   - GHL path: `services.leadconnectorhq.com`
   - Meta path: `graph.facebook.com`
4. **Meta path only:** add the environment variables from Step 3B in the same settings screen.
   GHL path: add nothing. Claude asks for the GHL token in a secure pop-up during Step 4, and it's saved under
   **Network secrets**.
5. Click **Save**. Then start a **new session**: pick the `<business>-ads` repo and the `<Business> ads` environment.
   Settings only reach sessions started after you save.

## Install the Meta Ads Mastery skill (3 minutes, buyers only)
The playbook Claude follows (testing, kill/scale rules, creative, tracking) is a **paid add-on**, so it is not in this public
template. You get it as a zip after purchase. Put it in **your private copy** of the repo, where every session can load it:
1. Unzip it. You get a folder named `meta-ads-mastery` with `SKILL.md` inside.
2. In your repo on GitHub, click **Add file → Upload files**, then drag the files in so they land in
   `.claude/skills/meta-ads-mastery/` (the path must end with `.claude/skills/meta-ads-mastery/SKILL.md`).
   Easier: start a session and tell Claude "install the skill" after uploading the zip to the chat; it puts the files there and commits them.
3. Start a new session and type `/`: you should see `meta-ads-mastery` and `ghl-ads` in the list.

Keep your copy **Private**: the skill is licensed to you and must not be shared or published.
**ghl-ads** (GoHighLevel Ad Manager) already ships in the repo, nothing to install.
Working locally instead? Put the folder in `~/.claude/skills/meta-ads-mastery/` to use it in every project.

## Step 3. Connect the ad account

### 3A. GoHighLevel (10 minutes)
In the business's GHL **sub-account** (not the agency view):
1. **Marketing → Ad Manager → connect Facebook.** Pick the business's own ad account and its own Facebook Page. Then set that Page as the **default**.
2. **Settings → Private Integrations → Create.** Name it "Claude Ads" and tick these 4 scopes:
   - `adPublishing.readonly`
   - `adPublishing.write`
   - `medias.readonly`
   - `medias.write`

   Copy the token, but **don't paste it in the chat**. Claude will pop up a secure form for it.
3. Copy the **Location ID** from **Settings → Business Profile** (it's also in the URL after `/location/`). This one is fine to paste in chat.

### 3B. Meta direct (20 minutes)
Follow `SETUP.md` steps 1-3. In short:
1. Make a Meta app and switch it to **Live**.
2. Create a system user and give it the ad account, the pixel and the Page.
3. Generate a token with these 6 permissions:
   - `ads_management`
   - `ads_read`
   - `business_management`
   - `pages_read_engagement`
   - `pages_manage_ads`
   - `pages_show_list`
4. Put these in the environment settings from Step 2:
   - `ACCESS_TOKEN`
   - `AD_ACCOUNT_ID`
   - `PAGE_ID`
   - `PIXEL_ID`

### Both paths: the pixel (do this before any spend)
1. In **Events Manager**, create a pixel (dataset) for **this business only**.
2. **Share it with the ad account:** go to **Business settings → Data sources → Datasets**, open the pixel, then **Connected assets → add the ad account**.

   If you skip this, every ad is rejected with *"Account does not have access to pixel."*
3. Put the pixel on every page of the website. Fire **one Lead event**, only on the thank-you page that people reach after signing up. Claude writes the exact text to paste into your site builder.

## Step 4. Paste the setup prompt (30 minutes, mostly answering questions)
In the session, open **`SETUP-PROMPT.md`** in the repo and paste everything between the lines. Claude then:
- checks the connection (GHL: `node ops/ghl/check.js`; Meta: `./scripts/meta-kit.sh doctor`) and tells you in plain words what's wrong, if anything
- asks a few questions at a time about the business, what a customer is worth and your daily budget, then fills in `client/`
- checks that the pixel and Lead event fire on the live site
- builds the first ads, runs the 4 creative checks and sends them to you

Have these ready: your **headshot** (it goes in `client/assets/photos/headshot.png`), your logo, and anything you know about your past ads.

## Step 5. Say yes and launch (5 minutes)
1. Claude builds the campaign **paused, as a draft**, and shows it to you.
2. Reply in your own words, for example: *"Yes, publish it at $20/day."*
3. Claude publishes it, confirms on Facebook that it's live and logs everything in `reports/`.
4. Say **"Set up the routines"** to get the daily check and report, the hourly spend safety check and your Ads HQ page.

From then on: read the daily message, answer the questions that need you, and Claude handles the rest under the rules in `CLAUDE.md`.

---

### If something goes wrong
| You see | Fix |
|---|---|
| "GHL will publish to act_XXX, but config says act_YYY" | In Ad Manager settings, disconnect Facebook, reconnect it and pick the right ad account. |
| Ads go *WITH_ISSUES*: "does not have access to pixel" | Share the pixel with the ad account (Step 3, the pixel). Then ask Claude to rebuild the campaign, because a published ad set can't switch pixels. |
| "Token can't use the media library" | Add `medias.readonly` and `medias.write` to the Private Integration. |
| 401 / "Invalid JWT" | The GHL token is missing or wrong. Ask Claude to "re-add the GHL token". |
| Claude says it can't reach your website | Add the site's domain under Allowed domains (Step 2), then start a new session. |
| Claude can't see the repo | Install the Claude GitHub App on it at claude.ai/connect-github, then start a new session with the repo selected. |
| `/` doesn't show the skills | Make sure the session was started on this repo (not an empty session). |
