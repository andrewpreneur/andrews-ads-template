#!/usr/bin/env bash
# Headless Chrome for cloud sessions: the container runs as root, which Chrome only allows with --no-sandbox.
# Use it as the renderers' browser: CHROME_PATH="$PWD/chrome-cloud.sh" node render-ads.js
exec "${CLOUD_CHROME:-/opt/pw-browsers/chromium-1243/chrome-linux64/chrome}" --no-sandbox "$@"
