#!/usr/bin/env node
// Render an HTML ad to PNG with headless Chrome. Usage: node render.js <in.html> <out.png> [WIDTHxHEIGHT]
// Set CHROME_PATH to the browser (in the cloud: CHROME_PATH="$PWD/chrome-cloud.sh").
const path = require("path"), { execFileSync } = require("child_process");
const [inFile, outFile, size = "1080x1350"] = process.argv.slice(2);
if (!inFile || !outFile) { console.error("Usage: node render.js <in.html> <out.png> [1080x1350]"); process.exit(1); }
const [w, h] = size.split("x").map(Number);
const chrome = process.env.CHROME_PATH || "google-chrome";
execFileSync(chrome, ["--headless", "--disable-gpu", "--force-device-scale-factor=1", "--hide-scrollbars",
  `--window-size=${w},${h}`, `--screenshot=${path.resolve(outFile)}`, `file://${path.resolve(inFile)}`], { stdio: "pipe" });
console.error(`Wrote ${outFile} (${w}x${h})`);
