#!/usr/bin/env node
// Static ad renderer: proven layouts only. tweet = tweet card with the owner's headshot; bold = heavy headline + support line
// + pill CTA (RepStack-style); list = bold skeleton + checklist (light or dark). 1080x1350.
// Usage: node ops/newads/render-statics.js ops/drafts/<batch>.json [name ...]
// Every element must sit inside a 40px safe margin; the script flags any that don't. Then look at every PNG full size.
const fs = require("fs"), path = require("path"), { execFileSync } = require("child_process");
const OUT = __dirname;
const A = (f) => `file://${path.join(OUT, "assets", f)}`;
const CHROME = process.env.CHROME_PATH || "google-chrome";
const HEADSHOT = path.join(OUT, "..", "..", "client", "assets", "photos", "headshot.png");
const AVATAR = fs.existsSync(HEADSHOT) ? `background:url('file://${HEADSHOT}') center 15%/cover #d9dde3` : null;
const CFG = JSON.parse(fs.readFileSync(path.join(OUT, "..", "..", "client", "config.json"), "utf8"));
const NAME = process.env.AD_NAME || (CFG.business.face && CFG.business.face.name) || CFG.business.name;
const ROLE = process.env.AD_ROLE || (CFG.business.face && CFG.business.face.role) || "";
const BRAND = CFG.business.name;
const MONO = BRAND.split(/\s+/).filter((w) => /^[A-Za-z]/.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

// Brand colors: set in client/config.json → design { dark, accent } (see client/business/design.md).
const NAVY = (CFG.design && CFG.design.dark) || "#0B1220", BLUE = (CFG.design && CFG.design.accent) || "#1C8BFF", INK = "#0F1419";
const fonts = `@font-face{font-family:'Anton';src:url('${A("fonts/Anton.ttf")}')}
@font-face{font-family:'Inter';src:url('${A("fonts/Inter.ttf")}')}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;position:relative;overflow:hidden}`;

const tweet = ({ lines, time, foot }) => `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
body{width:1080px;height:1350px;background:${NAVY};color:${INK};display:flex;flex-direction:column;justify-content:center;align-items:center;padding:0 80px}
.card{width:100%;background:#fff;border-radius:34px;padding:56px 60px 46px}
.who{display:flex;gap:24px;align-items:center}
.av{width:120px;height:120px;border-radius:50%;flex:none;${AVATAR || `background:${BLUE};color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:46px;letter-spacing:-.02em`}}
.name{font-weight:800;font-size:42px}.handle{font-size:30px;color:#536471;margin-top:4px}
.txt{margin-top:42px;font-size:50px;line-height:1.36;font-weight:500}
.txt p+p{margin-top:26px}
.meta{margin-top:38px;font-size:28px;color:#536471}
.foot{margin-top:72px;text-align:center;color:#fff;font-size:38px;font-weight:700}
.foot em{font-style:normal;color:${BLUE}}
</style></head><body>
<div class="card"><div class="who"><div class="av">${AVATAR ? "" : MONO}</div><div><div class="name">${NAME}</div><div class="handle">${ROLE}</div></div></div>
<div class="txt">${lines.map((l) => `<p>${l}</p>`).join("")}</div><div class="meta">${time}</div></div>
<div class="foot">${foot}</div>
</body></html>`;

const bold = ({ brand, headline, sub, cta, tag }) => `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
body{width:1080px;height:1350px;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:90px 70px}
.brand{display:flex;align-items:center;gap:18px;margin-bottom:70px}
.mono{width:84px;height:84px;border-radius:22px;background:${NAVY};color:${BLUE};font-weight:800;font-size:36px;display:flex;align-items:center;justify-content:center}
.bn{font-weight:800;font-size:40px;color:${NAVY};letter-spacing:-.01em}
.tag{display:inline-block;background:${BLUE};color:#fff;font-weight:800;font-size:30px;letter-spacing:.14em;padding:14px 26px;border-radius:12px;margin-bottom:40px}
h1{font-family:'Anton',Impact,sans-serif;color:${NAVY};font-size:112px;line-height:1.02;text-transform:uppercase;text-align:center;margin-bottom:46px}
h1 b{color:${BLUE};font-weight:400}
h2{font-size:46px;line-height:1.3;font-weight:700;color:#1F2937;text-align:center;max-width:900px;margin-bottom:64px}
.cta{background:${NAVY};color:#fff;border-radius:80px;padding:36px 70px;font-size:46px;font-weight:800;white-space:nowrap}
.cta em{font-style:normal;color:${BLUE}}
</style></head><body>
<div class="brand"><div class="mono">${MONO}</div><div class="bn">${brand}</div></div>
${tag ? `<div class="tag">${tag}</div>` : ""}
<h1>${headline}</h1><h2>${sub}</h2><div class="cta">${cta}</div>
</body></html>`;


const list = ({ headline, items, tag, dark, cta }) => `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
body{width:1080px;height:1350px;background:${dark ? NAVY : "#fff"};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 80px}
.brand{display:flex;align-items:center;gap:18px;margin-bottom:56px}
.mono{width:84px;height:84px;border-radius:22px;background:${dark ? BLUE : NAVY};color:${dark ? "#fff" : BLUE};font-weight:800;font-size:36px;display:flex;align-items:center;justify-content:center}
.bn{font-weight:800;font-size:40px;color:${dark ? "#fff" : NAVY}}
.tag{display:inline-block;background:${BLUE};color:#fff;font-weight:800;font-size:28px;letter-spacing:.1em;padding:14px 26px;border-radius:12px;margin-bottom:36px;text-align:center}
h1{font-family:'Anton',Impact,sans-serif;color:${dark ? "#fff" : NAVY};font-size:120px;line-height:1.02;text-transform:uppercase;text-align:center;margin-bottom:50px}
h1 b{color:${BLUE};font-weight:400}
ul{list-style:none;width:fit-content;max-width:900px;margin:0 auto 60px}
li{display:flex;align-items:center;gap:26px;font-size:46px;font-weight:700;color:${dark ? "#E5E7EB" : "#1F2937"};padding:16px 0}
li i{flex:none;width:58px;height:58px;border-radius:50%;background:${BLUE};color:#fff;font-style:normal;font-size:34px;display:flex;align-items:center;justify-content:center}
.cta{background:${dark ? BLUE : NAVY};color:#fff;border-radius:80px;padding:34px 70px;font-size:46px;font-weight:800;white-space:nowrap}
.cta em{font-style:normal;color:${dark ? NAVY : BLUE}}
</style></head><body>
<div class="brand"><div class="mono">${MONO}</div><div class="bn">${BRAND}</div></div>
${tag ? `<div class="tag">${tag}</div>` : ""}
<h1>${headline}</h1>
<ul>${items.map((t) => `<li><i>&#10003;</i>${t}</li>`).join("")}</ul>
<div class="cta">${cta}</div>
</body></html>`;

const DRAFT = process.argv[2];
if (!DRAFT) { console.error("usage: node render-statics.js <drafts.json> [name ...]"); process.exit(1); }
const D = JSON.parse(fs.readFileSync(path.resolve(DRAFT), "utf8"));
const esc = (t) => t.replace(/'/g, "&#8217;");
const html = (a) => a.format === "tweet"
  ? tweet({ time: D.tweetMeta || "", foot: D.tweetFoot || "", lines: a.image.map(esc) })
  : a.format === "bold" ? bold({ brand: BRAND, cta: D.cta_label || "Learn more", ...a.image, sub: esc(a.image.sub) })
  : list({ cta: D.cta_label || "Learn more", ...a.image });

(async () => {
  const { chromium } = require("playwright");
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(path.join(OUT, "png"), { recursive: true });
  const only = process.argv.slice(3); let bad = 0;
  for (const a of D.ads) {
    if (only.length && !only.includes(a.name)) continue;
    const tmp = path.join(OUT, `_${a.name}.html`); fs.writeFileSync(tmp, html(a));
    await p.goto(`file://${tmp}`); await p.waitForTimeout(150);
    const issues = await p.evaluate(() => { const out = []; const W = 1080, H = 1350, M = 40;
      for (const el of document.querySelectorAll("body *")) { const r = el.getBoundingClientRect(); if (!r.width) continue;
        if (r.left < M - 1 || r.top < M - 1 || r.right > W - M + 1 || r.bottom > H - M + 1) out.push(el.className || el.tagName);
        if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== "visible") out.push("scroll:" + (el.className || el.tagName)); }
      const all = [...document.body.children].map((e) => e.getBoundingClientRect());
      const top = Math.min(...all.map((r) => r.top)), bot = Math.max(...all.map((r) => r.bottom));
      return { issues: [...new Set(out)], top: Math.round(top), bottom: Math.round(bot) }; });
    await p.screenshot({ path: path.join(OUT, "png", `${a.name}.png`) }); fs.unlinkSync(tmp);
    const flag = issues.issues.length ? "  !! " + issues.issues.join(",") : "";
    if (flag) bad++;
    console.log(`${a.name.padEnd(18)} content ${issues.top}-${issues.bottom}px${flag}`);
  }
  await b.close(); console.log(bad ? `${bad} with issues` : "no overflow");
})();
