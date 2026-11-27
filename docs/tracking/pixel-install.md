# Pixel + Lead event: what to paste into your site builder

Claude fills in `PIXEL_ID` (from Events Manager) and `THANK_YOU_PATH` (the page people land on after signing up) and
gives you this text to paste into Lovable / AI Studio / your builder. Works for single-page apps.

## Prompt for the site builder
```
1. Add the Meta pixel to the <head> of every page with pixel ID PIXEL_ID (standard base code: fbq('init','PIXEL_ID');
   fbq('track','PageView'); plus the noscript image). This is a single-page app: also fire fbq('track','PageView') once on
   every client-side route change.
2. On THANK_YOU_PATH only, once the page has loaded, fire the Lead event exactly once per visit:
     if (window.fbq && !sessionStorage.getItem('lead_fired')) {
       sessionStorage.setItem('lead_fired', '1');
       window.fbq('track', 'Lead', { content_name: 'OFFER NAME' });
     }
   If fbq isn't loaded yet, check every 300ms for up to 5 seconds, then fire.
3. Don't fire Lead or any other conversion event anywhere else. Don't change anything else.
```
Then set the sign-up form to **redirect to THANK_YOU_PATH** after submit.

## How Claude checks it
- `curl` each page and look for `fbq('init', 'PIXEL_ID'` (base code on every page).
- Read the thank-you page's JS chunk for `track ... Lead` (event present, only there).
- GHL path: `node ops/ghl/check.js` confirms the pixel is on the connected ad account.
- Ask the owner to submit one test sign-up with Events Manager → Test events open, and confirm one Lead arrives.

## Rules
- One pixel per business, never shared with other sites (another site's events pollute optimization).
- Swapping pixels later means a new ad set: a published ad set's pixel is locked.
