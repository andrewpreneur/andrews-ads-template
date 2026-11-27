# Pixel hygiene
- The pixel (dataset) must belong to this business's sites only. A pixel that fires on other sites mixes their purchases and
  leads into yours and teaches Meta the wrong buyers. If it's shared, make a new one.
- Each page should fire its event once (no double Lead from a form + a thank-you page). Check in Events Manager → Test events.
- Turn off "Track events automatically without code" when a platform integration sends events, or events double up.
- Count real results from the business's records (Stripe, CRM), tied to ads by fbclid / UTM. Pixel numbers are for
  comparing ads, not for counting sales.
