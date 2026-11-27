# Creative rendering (HTML → PNG)
Build each static ad as an HTML file (1080×1350 feed or 1080×1920 story/reel), then render it to PNG with headless Chrome:

    cd ops/newads
    CHROME_PATH="$PWD/chrome-cloud.sh" node render.js my-ad.html png/my-ad.png 1080x1350

`chrome-cloud.sh` adds the `--no-sandbox` flag cloud sessions need. On a Mac, point `CHROME_PATH` at
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" instead. Put photos, cut-outs, logos and fonts in
`assets/` (or reference `client/assets/`). Always open the full-size PNG and run the 4 creative checks before uploading.
Launch with `ops/launch-ad.js` (drafts in `ops/drafts/`, always `--dry` first, created PAUSED).

## Proven static layouts (fastest path)
Write a batch file like `ops/drafts/example-statics.json` (formats: `tweet` with the owner's headshot, `bold`, `list`), then:

    node ops/newads/render-statics.js ops/drafts/<batch>.json

It uses the pre-installed Playwright Chromium, reads the owner's name/role and brand colors from `client/config.json`, and flags
anything outside a 40px safe margin. Headshot: `client/assets/photos/headshot.png`. GHL path: list the PNGs in a GHL draft
(`ops/drafts/example-ghl.json`) and `node ops/ghl/build.js` uploads them.
