# GHL Ad Publishing: operation reference

All 96 operations in HighLevel's public **Ad Publishing** API (full request/response schemas: `docs/ad-publishing-v3.md`) (`/ad-publishing/...`, API version 2021-04-15), as exposed by the
HighLevel connector (`mcp__HighLevel__search_operations` / `describe_operation` / `execute_operation`). Always call
`describe_operation` before a write to get the current body fields. Scopes: `adPublishing.readonly` (GET) and `adPublishing.write`.
Risk column = this repo's risk scale (0-7 do it and log it; 8+ needs the owner's yes in their own words).


## Facebook: connection (integration, pages, ad accounts, Instagram)

| Operation | Method + path | What it does | Risk |
|---|---|---|---|
| `fb-create-integration` | `POST /ad-publishing/facebook/integration` | Create Facebook integration | 8+ / see notes |
| `fb-delete-ad-account` | `DELETE /ad-publishing/facebook/ad-accounts/{adAccountId}` | Delete ad account | 8+ |
| `fb-delete-integration` | `DELETE /ad-publishing/facebook/integration` | Remove the Facebook integration from the sub-account | 8+ |
| `fb-delete-page` | `DELETE /ad-publishing/facebook/page` | Remove a Page connection | 8+ |
| `fb-get-ad-account` | `GET /ad-publishing/facebook/ad-accounts/{adAccountId}` | Get ad account details | 0 |
| `fb-get-ad-accounts` | `GET /ad-publishing/facebook/ad-accounts` | Get ad accounts | 0 |
| `fb-get-current-user` | `GET /ad-publishing/facebook/me` | Get current Facebook user | 0 |
| `fb-get-instagram-accounts` | `GET /ad-publishing/facebook/page/{pageId}/instagram` | Instagram accounts linked to a Page | 0 |
| `fb-get-integration` | `GET /ad-publishing/facebook/integration` | Get Facebook integration | 0 |
| `fb-get-pages` | `GET /ad-publishing/facebook/pages` | Get Facebook pages | 0 |
| `fb-set-default-page` | `PUT /ad-publishing/facebook/page/default` | Set default page | 0-7 |

## Facebook: campaigns, ad sets, ads

| Operation | Method + path | What it does | Risk |
|---|---|---|---|
| `fb-add-custom-audience-member` | `PUT /ad-publishing/facebook/custom-audience/{customAudienceId}/member` | Add one GHL contact to a custom audience (hashed before sending) | 8+ / see notes |
| `fb-delete-ad` | `DELETE /ad-publishing/facebook/ads/{adId}` | Delete ad | 8+ |
| `fb-delete-adset` | `DELETE /ad-publishing/facebook/adsets/{adSetId}` | Delete ad set | 8+ |
| `fb-delete-campaign` | `DELETE /ad-publishing/facebook/campaigns/{campaignId}` | Delete campaign | 8+ |
| `fb-duplicate-ad` | `POST /ad-publishing/facebook/ads/{adId}/duplicate` | Duplicate ad | 8+ / see notes |
| `fb-duplicate-adset` | `POST /ad-publishing/facebook/adsets/{adSetId}/duplicate` | Duplicate ad set | 8+ / see notes |
| `fb-duplicate-campaign` | `POST /ad-publishing/facebook/campaigns/{campaignId}/duplicate` | Duplicate campaign | 8+ / see notes |
| `fb-get-campaign` | `GET /ad-publishing/facebook/campaign/{campaignId}` | Get campaign with linked entities | 0 |
| `fb-get-campaign-publishing-progress` | `GET /ad-publishing/facebook/campaigns/{campaignId}/publishing-progress` | Poll publish progress after fb-publish-campaign | 8+ / see notes |
| `fb-get-entity` | `GET /ad-publishing/facebook/entity` | Get entities | 0 |
| `fb-pause-ad` | `POST /ad-publishing/facebook/ads/{adId}/pause` | Pause ad | 0-7 |
| `fb-pause-adset` | `POST /ad-publishing/facebook/adsets/{adSetId}/pause` | Pause ad set | 0-7 |
| `fb-pause-campaign` | `POST /ad-publishing/facebook/campaigns/{campaignId}/pause` | Pause campaign | 0-7 |
| `fb-publish-campaign` | `POST /ad-publishing/facebook/campaigns/{campaignId}/publish` | Publish campaign | 8+ / see notes |
| `fb-resume-ad` | `POST /ad-publishing/facebook/ads/{adId}/resume` | Resume ad | 8+ / see notes |
| `fb-resume-adset` | `POST /ad-publishing/facebook/adsets/{adSetId}/resume` | Resume ad set | 8+ / see notes |
| `fb-resume-campaign` | `POST /ad-publishing/facebook/campaigns/{campaignId}/resume` | Resume campaign | 8+ / see notes |
| `fb-upsert-ad` | `PUT /ad-publishing/facebook/ads` | Upsert ad | 0-7 |
| `fb-upsert-adset` | `PUT /ad-publishing/facebook/adsets` | Upsert adset | 8+ / see notes |
| `fb-upsert-campaign` | `PUT /ad-publishing/facebook/campaigns` | Upsert campaign | 8+ / see notes |

## Facebook: reporting

| Operation | Method + path | What it does | Risk |
|---|---|---|---|
| `fb-get-campaign-reporting` | `GET /ad-publishing/facebook/reporting/campaign/{campaignId}` | One published campaign: Meta insights + CRM-attributed contacts (leads) | 0 |
| `fb-get-reporting` | `GET /ad-publishing/facebook/reporting` | Account-level reporting: grouped by day/week/month + totals | 0 |
| `fb-get-reporting-list` | `GET /ad-publishing/facebook/reporting/list` | Get reporting list | 0 |

## Facebook: targeting, pixels, audiences

| Operation | Method + path | What it does | Risk |
|---|---|---|---|
| `fb-batch-update-audience-members` | `PUT /ad-publishing/facebook/custom-audience/{customAudienceId}/member/batch` | Bulk add/remove members from a CSV or smart lists (queued job) | 8+ / see notes |
| `fb-delete-custom-audience` | `DELETE /ad-publishing/facebook/custom-audience/{customAudienceId}` | Delete custom audience | 8+ |
| `fb-get-custom-audience-by-id` | `GET /ad-publishing/facebook/custom-audience/{customAudienceId}` | Get custom audience by ID (full detail: lookalikeSpec, website rule, customer-list source) | 0 |
| `fb-get-custom-audiences` | `GET /ad-publishing/facebook/custom-audience` | Get custom audiences | 0 |
| `fb-get-pixels` | `GET /ad-publishing/facebook/pixels` | Get conversion pixels | 0 |
| `fb-remove-custom-audience-member` | `DELETE /ad-publishing/facebook/custom-audience/{customAudienceId}/member` | Remove one contact (body carries locationId + contactId) | 8+ |
| `fb-search-targeting` | `GET /ad-publishing/facebook/targeting/search` | Search targeting options | 0 |
| `fb-update-custom-audience` | `PUT /ad-publishing/facebook/custom-audience/{customAudienceId}` | Rename / re-describe a custom audience (membership via member endpoints) | 0-7 |
| `fb-upsert-pixel` | `PUT /ad-publishing/facebook/pixels` | Upsert conversion pixel | 8+ / see notes |

## Facebook: lead forms and conversation forms

| Operation | Method + path | What it does | Risk |
|---|---|---|---|
| `fb-create-conversation-form` | `POST /ad-publishing/facebook/conversation-forms` | Create conversation form | 0-7 |
| `fb-create-page-lead-form` | `POST /ad-publishing/facebook/page/{pageId}/forms` | Create an instant form (isDraft:true = local draft; otherwise published to Meta; needs ≥1 question + thankYouPage) | 0-7 |
| `fb-get-conversation-forms` | `GET /ad-publishing/facebook/conversation-forms` | Get conversation forms | 0 |
| `fb-get-lead-form` | `GET /ad-publishing/facebook/lead-form/{leadFormId}` | Get one instant form (isDraft=true for drafts) | 0 |
| `fb-get-page-lead-forms` | `GET /ad-publishing/facebook/page/{pageId}/forms` | Instant (lead gen) forms for a Page, published + drafts | 0 |

## Google Ads

| Operation | Method + path | What it does | Risk |
|---|---|---|---|
| `google-create-integration` | `POST /ad-publishing/google/integration` | Create Google integration | 8+ / see notes |
| `google-create-offline-user-list-job` | `POST /ad-publishing/google/segments/offline-user-list-job` | Create offline user list job | 0-7 |
| `google-delete-ad-account` | `DELETE /ad-publishing/google/ad-accounts/{adAccountId}` | Delete ad account | 8+ |
| `google-delete-conversion` | `DELETE /ad-publishing/google/conversions/{conversionId}` | Delete conversion | 8+ |
| `google-delete-segment` | `DELETE /ad-publishing/google/segments/{segmentId}` | Delete segment | 8+ |
| `google-get-ad-account-details` | `GET /ad-publishing/google/ad-accounts/{adAccountId}` | Get ad account details | 0 |
| `google-get-ad-accounts` | `GET /ad-publishing/google/ad-accounts` | Get Google ad accounts | 0 |
| `google-get-assets` | `GET /ad-publishing/google/assets` | Get assets | 0 |
| `google-get-audience-by-id` | `GET /ad-publishing/google/audiences/{audienceId}` | Get audience by ID | 0 |
| `google-get-audiences` | `GET /ad-publishing/google/audiences` | Get audiences | 0 |
| `google-get-campaign-by-id` | `GET /ad-publishing/google/ads/{adId}` | Get Google campaign by ID | 0 |
| `google-get-campaign-reporting` | `GET /ad-publishing/google/reporting/campaign/{campaignId}` | Get campaign reporting | 0 |
| `google-get-conversion-by-id` | `GET /ad-publishing/google/conversions/{conversionId}` | Get conversion by ID | 0 |
| `google-get-conversion-goals` | `GET /ad-publishing/google/conversion-goals` | Get conversion goals | 0 |
| `google-get-conversions` | `GET /ad-publishing/google/conversions` | Get conversions | 0 |
| `google-get-current-user` | `GET /ad-publishing/google/me` | Get current Google user | 0 |
| `google-get-entity` | `GET /ad-publishing/google/entity` | Get entities | 0 |
| `google-get-integration` | `GET /ad-publishing/google/integration` | Get Google integration | 0 |
| `google-get-keyword-ideas` | `POST /ad-publishing/google/keyword-ideas` | Get keyword ideas | 0-7 |
| `google-get-publishing-progress` | `GET /ad-publishing/google/ads/{adId}/publishing-progress` | Get ad publishing progress | 8+ / see notes |
| `google-get-reporting` | `GET /ad-publishing/google/reporting` | Get reporting data | 0 |
| `google-get-reporting-list` | `GET /ad-publishing/google/reporting/list` | Get reporting list | 0 |
| `google-get-segment-by-id` | `GET /ad-publishing/google/segments/{segmentId}` | Get segment by ID | 0 |
| `google-get-segments` | `GET /ad-publishing/google/segments` | Get segments | 0 |
| `google-get-target-interests` | `GET /ad-publishing/google/target-interests` | Get target interests | 0 |
| `google-publish-ad` | `POST /ad-publishing/google/ads/{adId}/publish` | Publish ad | 8+ / see notes |
| `google-search-targeting` | `GET /ad-publishing/google/targeting/search` | Search targeting options | 0 |
| `google-upsert-assets` | `POST /ad-publishing/google/assets` | Upsert assets | 0-7 |
| `google-upsert-audience` | `PUT /ad-publishing/google/audiences` | Upsert audience | 0-7 |
| `google-upsert-campaign` | `PUT /ad-publishing/google/ads` | Upsert Google campaign | 8+ / see notes |
| `google-upsert-conversion` | `PUT /ad-publishing/google/conversions` | Upsert conversion | 0-7 |
| `google-upsert-segment` | `PUT /ad-publishing/google/segments` | Upsert segment | 0-7 |

## LinkedIn Ads

| Operation | Method + path | What it does | Risk |
|---|---|---|---|
| `li-get-current-user` | `GET /ad-publishing/linkedin/me` | Get current LinkedIn user | 0 |
| `li-publish-ad` | `POST /ad-publishing/linkedin/ads/{adId}/publish` | Publish a LinkedIn campaign group | 8+ / see notes |
| `li-search-targeting` | `GET /ad-publishing/linkedin/targeting/search` | Search LinkedIn targeting facets (locations, industries, job titles) | 0 |
| `li-create-integration` | `POST /ad-publishing/linkedin/integration` | Create LinkedIn integration | 8+ / see notes |
| `li-create-lead-form` | `POST /ad-publishing/linkedin/{accountId}/form` | Create lead form | 0-7 |
| `li-delete-ad-account` | `DELETE /ad-publishing/linkedin/ad-account` | Delete ad account | 8+ |
| `li-get-ad-account-details` | `GET /ad-publishing/linkedin/ad-account` | Get ad account details | 0 |
| `li-get-ad-accounts` | `GET /ad-publishing/linkedin/ad-accounts` | Get LinkedIn ad accounts | 0 |
| `li-get-ad-analytics` | `GET /ad-publishing/linkedin/reporting` | Get ad analytics | 0 |
| `li-get-campaign-group` | `GET /ad-publishing/linkedin/ads/{adId}` | Get ad campaign group | 0 |
| `li-get-campaign-group-reporting` | `GET /ad-publishing/linkedin/reporting/campaign-group/{campaignGroupId}` | Get campaign group reporting | 0 |
| `li-get-integration` | `GET /ad-publishing/linkedin/integration` | Get LinkedIn integration | 0 |
| `li-get-lead-forms` | `GET /ad-publishing/linkedin/{accountId}/forms` | Get lead forms | 0 |
| `li-get-reporting-list` | `GET /ad-publishing/linkedin/reporting/list` | Get reporting list | 0 |
| `li-update-ad-status` | `PATCH /ad-publishing/linkedin/{adId}/status` | Update ad status | 8+ / see notes |
| `li-upsert-campaign-group` | `PUT /ad-publishing/linkedin/ads` | Upsert ad campaign group | 8+ / see notes |
