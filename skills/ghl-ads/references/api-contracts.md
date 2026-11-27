# HighLevel Ad Publishing API: operation contracts

Source: the HighLevel public API registry, read through the HighLevel MCP connector (`search_operations` + `describe_operation`, domain `ad-publishing`, API version 2021-04-15). Generated 2026-11-06 from `operations-full.json` (same folder), which holds the raw `describe_operation` objects. No operation was executed to build this file.

**96 operations**: Facebook / Instagram (Meta) 48, Google Ads 32, LinkedIn Ads 16.

## How to call

1. `search_operations` with `domains: ["ad-publishing"]` to find the operationId.
2. `describe_operation <operationId>` to read the live contract (it can change; this file is a snapshot).
3. `execute_operation` with `params: {path, query, body}` shaped like the `payloadExample` below, first with `dryRun: true` to preview the resolved request, then for real with an `idempotencyKey` and a short `reason`. Every write/delete is `requiresApproval: true` on the connector.
4. The connector is bound to one GHL location (sub-account); `locationId` is filled in for you.
5. Query parameters typed `array` are sent comma-separated on the wire (`?fields=impressions,clicks`).

Conventions below: `*` after a nested property = required inside that object. "Response" lists the top-level keys and, where the registry gives them, the fields of the main collection (`collectionKey`). `union` = the shape depends on the parameters (usually: plain array without `limit`, `{<collection>, paging}` envelope with `limit`).

## Contents

- **Facebook / Instagram (Meta)**
  - [Integration & account](#facebook--instagram-meta--integration--account): [`fb-create-integration`](#fb-create-integration), [`fb-delete-ad-account`](#fb-delete-ad-account), [`fb-delete-integration`](#fb-delete-integration), [`fb-get-ad-account`](#fb-get-ad-account), [`fb-get-ad-accounts`](#fb-get-ad-accounts), [`fb-get-current-user`](#fb-get-current-user), [`fb-get-integration`](#fb-get-integration)
  - [Pages & Instagram](#facebook--instagram-meta--pages--instagram): [`fb-delete-page`](#fb-delete-page), [`fb-get-instagram-accounts`](#fb-get-instagram-accounts), [`fb-get-pages`](#fb-get-pages), [`fb-set-default-page`](#fb-set-default-page)
  - [Campaigns](#facebook--instagram-meta--campaigns): [`fb-delete-campaign`](#fb-delete-campaign), [`fb-duplicate-campaign`](#fb-duplicate-campaign), [`fb-get-campaign`](#fb-get-campaign), [`fb-get-campaign-publishing-progress`](#fb-get-campaign-publishing-progress), [`fb-pause-campaign`](#fb-pause-campaign), [`fb-publish-campaign`](#fb-publish-campaign), [`fb-resume-campaign`](#fb-resume-campaign), [`fb-upsert-campaign`](#fb-upsert-campaign)
  - [Ad sets](#facebook--instagram-meta--ad-sets): [`fb-delete-adset`](#fb-delete-adset), [`fb-duplicate-adset`](#fb-duplicate-adset), [`fb-pause-adset`](#fb-pause-adset), [`fb-resume-adset`](#fb-resume-adset), [`fb-upsert-adset`](#fb-upsert-adset)
  - [Ads](#facebook--instagram-meta--ads): [`fb-delete-ad`](#fb-delete-ad), [`fb-duplicate-ad`](#fb-duplicate-ad), [`fb-pause-ad`](#fb-pause-ad), [`fb-resume-ad`](#fb-resume-ad), [`fb-upsert-ad`](#fb-upsert-ad)
  - [Entities (list)](#facebook--instagram-meta--entities-list): [`fb-get-entity`](#fb-get-entity)
  - [Lead forms](#facebook--instagram-meta--lead-forms): [`fb-create-conversation-form`](#fb-create-conversation-form), [`fb-create-page-lead-form`](#fb-create-page-lead-form), [`fb-get-conversation-forms`](#fb-get-conversation-forms), [`fb-get-lead-form`](#fb-get-lead-form), [`fb-get-page-lead-forms`](#fb-get-page-lead-forms)
  - [Custom audiences](#facebook--instagram-meta--custom-audiences): [`fb-add-custom-audience-member`](#fb-add-custom-audience-member), [`fb-batch-update-audience-members`](#fb-batch-update-audience-members), [`fb-delete-custom-audience`](#fb-delete-custom-audience), [`fb-get-custom-audience-by-id`](#fb-get-custom-audience-by-id), [`fb-get-custom-audiences`](#fb-get-custom-audiences), [`fb-remove-custom-audience-member`](#fb-remove-custom-audience-member), [`fb-update-custom-audience`](#fb-update-custom-audience)
  - [Pixels / conversions](#facebook--instagram-meta--pixels--conversions): [`fb-get-pixels`](#fb-get-pixels), [`fb-upsert-pixel`](#fb-upsert-pixel)
  - [Targeting](#facebook--instagram-meta--targeting): [`fb-search-targeting`](#fb-search-targeting)
  - [Reporting](#facebook--instagram-meta--reporting): [`fb-get-campaign-reporting`](#fb-get-campaign-reporting), [`fb-get-reporting`](#fb-get-reporting), [`fb-get-reporting-list`](#fb-get-reporting-list)
- **Google Ads**
  - [Integration & account](#google-ads--integration--account): [`google-create-integration`](#google-create-integration), [`google-delete-ad-account`](#google-delete-ad-account), [`google-get-ad-account-details`](#google-get-ad-account-details), [`google-get-ad-accounts`](#google-get-ad-accounts), [`google-get-current-user`](#google-get-current-user), [`google-get-integration`](#google-get-integration)
  - [Campaigns](#google-ads--campaigns): [`google-get-campaign-by-id`](#google-get-campaign-by-id), [`google-get-publishing-progress`](#google-get-publishing-progress), [`google-publish-ad`](#google-publish-ad), [`google-upsert-campaign`](#google-upsert-campaign)
  - [Entities (list)](#google-ads--entities-list): [`google-get-entity`](#google-get-entity)
  - [Audiences & segments](#google-ads--audiences--segments): [`google-create-offline-user-list-job`](#google-create-offline-user-list-job), [`google-delete-segment`](#google-delete-segment), [`google-get-audience-by-id`](#google-get-audience-by-id), [`google-get-audiences`](#google-get-audiences), [`google-get-segment-by-id`](#google-get-segment-by-id), [`google-get-segments`](#google-get-segments), [`google-upsert-audience`](#google-upsert-audience), [`google-upsert-segment`](#google-upsert-segment)
  - [Conversions](#google-ads--conversions): [`google-delete-conversion`](#google-delete-conversion), [`google-get-conversion-by-id`](#google-get-conversion-by-id), [`google-get-conversion-goals`](#google-get-conversion-goals), [`google-get-conversions`](#google-get-conversions), [`google-upsert-conversion`](#google-upsert-conversion)
  - [Assets](#google-ads--assets): [`google-get-assets`](#google-get-assets), [`google-upsert-assets`](#google-upsert-assets)
  - [Keywords](#google-ads--keywords): [`google-get-keyword-ideas`](#google-get-keyword-ideas)
  - [Targeting](#google-ads--targeting): [`google-get-target-interests`](#google-get-target-interests), [`google-search-targeting`](#google-search-targeting)
  - [Reporting](#google-ads--reporting): [`google-get-campaign-reporting`](#google-get-campaign-reporting), [`google-get-reporting`](#google-get-reporting), [`google-get-reporting-list`](#google-get-reporting-list)
- **LinkedIn Ads**
  - [Integration & account](#linkedin-ads--integration--account): [`li-create-integration`](#li-create-integration), [`li-delete-ad-account`](#li-delete-ad-account), [`li-get-ad-account-details`](#li-get-ad-account-details), [`li-get-ad-accounts`](#li-get-ad-accounts), [`li-get-current-user`](#li-get-current-user), [`li-get-integration`](#li-get-integration)
  - [Campaign groups](#linkedin-ads--campaign-groups): [`li-get-campaign-group`](#li-get-campaign-group), [`li-publish-campaign-group`](#li-publish-campaign-group), [`li-update-ad-status`](#li-update-ad-status), [`li-upsert-campaign-group`](#li-upsert-campaign-group)
  - [Lead forms](#linkedin-ads--lead-forms): [`li-create-lead-form`](#li-create-lead-form), [`li-get-lead-forms`](#li-get-lead-forms)
  - [Targeting](#linkedin-ads--targeting): [`li-search-targeting`](#li-search-targeting)
  - [Reporting](#linkedin-ads--reporting): [`li-get-ad-analytics`](#li-get-ad-analytics), [`li-get-campaign-group-reporting`](#li-get-campaign-group-reporting), [`li-get-reporting-list`](#li-get-reporting-list)

## Facebook / Instagram (Meta) — Integration & account

### fb-create-integration

`POST /ad-publishing/facebook/integration`

**Create Facebook integration.** Create a Facebook ad integration for a location with page and ad account

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `pageId` | yes | string | Facebook page ID | "123456789" |
| `adAccountId` |  | string | Ad account identifier | "act_123456" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "pageId": "<connected page id>",
      "adAccountId": "<meta ad account id>"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `createdAt`, `fbAdAccountId`, `fbDefaultPageId`, `id`, `locationId`, `pages`, `pricingModel`, `status`, `unSubscriptionReasons`, `updatedAt`, `userAccessToken`
  - collection: `pages`
  - item fields: `_id`, `accessToken`, `createdOn`, `id`, `name`

### fb-delete-ad-account

`DELETE /ad-publishing/facebook/ad-accounts/{adAccountId}`

**Delete ad account.** Remove a Facebook ad account connection from a location

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adAccountId` | path | yes | string | Ad account identifier | "act_123456789" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adAccountId": "act_123456789"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-delete-integration

`DELETE /ad-publishing/facebook/integration`

**Delete Facebook integration.** Remove the Facebook ad integration from a location

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required
- request: application/json

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-get-ad-account

`GET /ad-publishing/facebook/ad-accounts/{adAccountId}`

**Get ad account details.** Retrieve details of a specific Facebook ad account

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adAccountId` | path | yes | string | Ad account identifier | "act_123456789" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "adAccountId": "act_123456789"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `accountStatus`, `business`, `currency`, `fundingType`, `id`, `name`, `timezoneName`

### fb-get-ad-accounts

`GET /ad-publishing/facebook/ad-accounts`

**Get ad accounts.** Retrieve Facebook ad accounts available for the connected user

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `fetchAll` | query |  | string | Fetch all accounts | "true" |
| `limit` | query |  | string | Results page limit | "25" |
| `next` | query |  | string | Pagination cursor | "cursor_abc" |
| `type` | query |  | string enum: `INTEGRATION`, `AD_MANAGER` | Account source type | "AD_MANAGER" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200
  - item fields: `accountStatus`, `business`, `currency`, `fundingType`, `id`, `integrationConnected`, `name`

### fb-get-current-user

`GET /ad-publishing/facebook/me`

**Get current Facebook user.** Retrieve the authenticated Facebook user profile for a location

- kind: `read` · scopes: `adPublishing.readonly`

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `id`, `name`, `picture`

### fb-get-integration

`GET /ad-publishing/facebook/integration`

**Get Facebook integration.** Retrieve the Facebook ad integration details for a location

- kind: `read` · scopes: `adPublishing.readonly`

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `fbAdAccountId`, `fbBusinessId`, `fbDefaultPageId`, `locationId`, `pages`, `pricingModel`, `status`
  - collection: `pages`
  - item fields: `_id`, `accessToken`, `createdOn`, `id`, `name`

## Facebook / Instagram (Meta) — Pages & Instagram

### fb-delete-page

`DELETE /ad-publishing/facebook/page`

**Delete page connection.** Remove a Facebook page connection from a location.

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `pageId` | query | yes | string | Facebook page ID | "123456789" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-get-instagram-accounts

`GET /ad-publishing/facebook/page/{pageId}/instagram`

**Get Instagram accounts for page.** Retrieve Instagram accounts linked to a specific Facebook page

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `pageId` | path | yes | string | Facebook page identifier | "103456789012345" |
| `type` | query |  | string enum: `INTEGRATION`, `AD_MANAGER` | Integration type | "INTEGRATION" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "pageId": "103456789012345"
    },
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200
  - item fields: `id`, `name`, `picture`, `typeOfAccount`

### fb-get-pages

`GET /ad-publishing/facebook/pages`

**Get Facebook pages.** Retrieve Facebook pages for the connected account. When `limit` is provided the response is a paginated `{ pages, paging }` envelope; pass `after` (from `paging.next`) to fetch the next batch.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `after` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "QVFIU..." |
| `fetchExisting` | query |  | string | Fetch existing pages flag | "true" |
| `limit` | query |  | string | Page size for a paginated fetch (fetchExisting only, max 50). When set, the response is a { pages, paging } envelope instead of an array. | "50" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
    - item fields: `category`, `createdOn`, `id`, `isConnected`, `isDefault`, `name`, `picture`, `tosAccepted`
  - shape `object`, status 200
    - top-level keys: `pages`, `paging`
    - collection: `pages`
    - item fields: `category`, `createdOn`, `id`, `isConnected`, `isDefault`, `name`, `picture`, `tosAccepted`

### fb-set-default-page

`PUT /ad-publishing/facebook/page/default`

**Set default page.** Set the default Facebook page for a location

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `pageId` | yes | string | Facebook page identifier | "103456789012345" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "pageId": "<facebook page id>"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

## Facebook / Instagram (Meta) — Campaigns

### fb-delete-campaign

`DELETE /ad-publishing/facebook/campaigns/{campaignId}`

**Delete campaign.** Delete a Facebook campaign by ID

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | path | yes | string | Campaign identifier | "507f1f77bcf86cd799439011" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignId": "507f1f77bcf86cd799439011"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-duplicate-campaign

`POST /ad-publishing/facebook/campaigns/{campaignId}/duplicate`

**Duplicate campaign.** Duplicate an existing Facebook campaign

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | path | yes | string | Campaign identifier | "507f1f77bcf86cd799439011" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignId": "507f1f77bcf86cd799439011"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adsets`, `createdAt`, `fbAdAccountId`, `fbCampaignId`, `fbError`, `id`, `locationId`, `meta`, `name`, `objective`, `publishingStatus`, `source`, `specialAdCategories`, `unpublishedChanges`, `updatedAt`
  - collection: `adsets`
  - item fields: `ads`, `audience`, `budget`, `campaignId`, `conversionLocation`, `createdAt`, `fbAdSetId`, `fbError`, `id`, `instagramActorId`, `messagingPlatforms`, `name`, `pageId`, `publishingStatus`, `unpublishedChanges`, `updatedAt`

### fb-get-campaign

`GET /ad-publishing/facebook/campaign/{campaignId}`

**Get campaign with linked entities.** Retrieve a Facebook campaign with its linked adsets and ads

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | path | yes | string | Campaign identifier | "507f1f77bcf86cd799439011" |
| `fields` | query |  | string | Comma-separated field names | "adsets,ads" |
| `source` | query |  | string | Campaign data source | "facebook" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignId": "507f1f77bcf86cd799439011"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adsets`, `createdAt`, `fbAdAccountId`, `fbCampaignId`, `fbError`, `id`, `locationId`, `meta`, `name`, `objective`, `publishingStatus`, `source`, `specialAdCategories`, `unpublishedChanges`, `updatedAt`
  - collection: `adsets`
  - item fields: `ads`, `audience`, `budget`, `campaignId`, `conversionLocation`, `createdAt`, `fbAdSetId`, `fbError`, `id`, `instagramActorId`, `messagingPlatforms`, `name`, `pageId`, `publishingStatus`, `unpublishedChanges`, `updatedAt`

### fb-get-campaign-publishing-progress

`GET /ad-publishing/facebook/campaigns/{campaignId}/publishing-progress`

**Get campaign publishing progress.** Returns Redis-backed publish progress for a campaign while it is publishing to Meta. Used by the validation funnel UI to poll step counts and completion state.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | path | yes | string | Campaign identifier | "507f1f77bcf86cd799439011" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignId": "507f1f77bcf86cd799439011"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `campaignId`, `hasFailed`, `isComplete`, `processed`, `publishingStatus`, `total`

### fb-pause-campaign

`POST /ad-publishing/facebook/campaigns/{campaignId}/pause`

**Pause campaign.** Pause a running Facebook campaign

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | path | yes | string | Campaign identifier | "507f1f77bcf86cd799439011" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignId": "507f1f77bcf86cd799439011"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-publish-campaign

`POST /ad-publishing/facebook/campaigns/{campaignId}/publish`

**Publish campaign.** Queue a Facebook campaign for publishing and push it live to Facebook. Publishing runs asynchronously, so the campaign comes back in the state it was queued in — `publishingStatus` is still `DRAFT` on the campaign and on every ad set and ad, and no Facebook ids are attached yet. Poll GET /facebook/campaigns/{campaignId}/publishing-progress for the outcome.

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | path | yes | string | Campaign identifier | "507f1f77bcf86cd799439011" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignId": "507f1f77bcf86cd799439011"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adsets`, `createdAt`, `fbAdAccountId`, `fbCampaignId`, `fbError`, `id`, `locationId`, `meta`, `name`, `objective`, `publishingStatus`, `source`, `specialAdCategories`, `unpublishedChanges`, `updatedAt`
  - collection: `adsets`
  - item fields: `ads`, `audience`, `budget`, `campaignId`, `conversionLocation`, `createdAt`, `fbAdSetId`, `fbError`, `id`, `instagramActorId`, `messagingPlatforms`, `name`, `pageId`, `publishingStatus`, `unpublishedChanges`, `updatedAt`

### fb-resume-campaign

`POST /ad-publishing/facebook/campaigns/{campaignId}/resume`

**Resume campaign.** Resume a paused Facebook campaign

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | path | yes | string | Campaign identifier | "507f1f77bcf86cd799439011" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignId": "507f1f77bcf86cd799439011"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-upsert-campaign

`PUT /ad-publishing/facebook/campaigns`

**Upsert campaign.** Create or update a Facebook campaign

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `id` |  | string | Campaign identifier | "camp_123" |
| `name` |  | string | Campaign name | "Summer Campaign" |
| `objective` |  | string enum: `OUTCOME_LEADS`, `OUTCOME_TRAFFIC`, `OUTCOME_ENGAGEMENT`, `OUTCOME_SALES` | Campaign objective | "OUTCOME_LEADS" |
| `specialAdCategories` |  | array<string> enum: `EMPLOYMENT`, `CREDIT`, `FINANCIAL_PRODUCTS_SERVICES`, `HOUSING`, `ISSUES_ELECTIONS_POLITICS`, `ONLINE_GAMBLING_AND_GAMING`, `NONE` | Special ad categories | ["NONE"] |
| `isCampaignBudget` |  | boolean | Advantage campaign budget. When true the campaign carries `budget` and `bidStrategy`, and ad sets carry no budget of their own. | false |
| `budget` |  | object — {budgetType*: string enum: `DAILY`, `LIFETIME`, amount*: number, scheduleStartDate: string, scheduleEndDate: string} | Campaign-level budget (Advantage campaign budget). Requires isCampaignBudget. | {"budgetType": "DAILY", "amount": 1000} |
| `bidStrategy` |  | string enum: `LOWEST_COST_WITHOUT_CAP`, `LOWEST_COST_WITH_BID_CAP`, `COST_CAP` | Campaign-level bid strategy. Only with isCampaignBudget. | "LOWEST_COST_WITHOUT_CAP" |
| `bidAmount` |  | number | Default bid cap / cost-per-result goal in account currency for every ad set; an ad set's own bidAmount wins. Only with isCampaignBudget or adsetBudgetSharing. | 2.5 |
| `adsetBudgetSharing` |  | boolean | Ad set budget sharing: Meta may move up to 20% of an ad set budget to sibling ad sets. Mutually exclusive with isCampaignBudget. | false |
| `source` |  | string | Campaign data source | "facebook" |
| `customValueMappings` |  | object | User-provided overrides for custom_values merge tags used in ad copy | {"{{ custom_values.pet_name }}": "Fluffy"} |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "name": "Summer Promo",
      "objective": "OUTCOME_ENGAGEMENT",
      "specialAdCategories": [
        "NONE"
      ],
      "source": "ASK_AI"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `createdAt`, `fbAdAccountId`, `fbCampaignId`, `fbError`, `id`, `locationId`, `meta`, `name`, `objective`, `publishingStatus`, `source`, `specialAdCategories`, `unpublishedChanges`, `updatedAt`
  - collection: `specialAdCategories`

## Facebook / Instagram (Meta) — Ad sets

### fb-delete-adset

`DELETE /ad-publishing/facebook/adsets/{adSetId}`

**Delete ad set.** Delete a Facebook ad set by ID

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adSetId` | path | yes | string | Ad set identifier | "507f1f77bcf86cd799439012" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adSetId": "507f1f77bcf86cd799439012"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-duplicate-adset

`POST /ad-publishing/facebook/adsets/{adSetId}/duplicate`

**Duplicate ad set.** Duplicate an existing Facebook ad set

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adSetId` | path | yes | string | Ad set identifier | "507f1f77bcf86cd799439012" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adSetId": "507f1f77bcf86cd799439012"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `ads`, `audience`, `budget`, `campaignId`, `conversionLocation`, `createdAt`, `fbAdSetId`, `fbError`, `id`, `instagramActorId`, `messagingPlatforms`, `name`, `pageId`, `publishingStatus`, `unpublishedChanges`, `updatedAt`
  - collection: `ads`
  - item fields: `adsetId`, `campaignId`, `createdAt`, `cta`, `description`, `descriptions`, `destinationFormId`, `destinationLink`, `fbAdId`, `fbError`, `headline`, `headlines`, `id`, `media`, `mediaType`, `multiAdvertiserAds`, `name`, `primaryText`, `primaryTexts`, `publishingStatus`, `unpublishedChanges`, `updatedAt`

### fb-pause-adset

`POST /ad-publishing/facebook/adsets/{adSetId}/pause`

**Pause ad set.** Pause a running Facebook ad set

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adSetId` | path | yes | string | Ad set identifier | "507f1f77bcf86cd799439012" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adSetId": "507f1f77bcf86cd799439012"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adsets`, `createdAt`, `fbAdAccountId`, `fbCampaignId`, `fbError`, `id`, `locationId`, `meta`, `name`, `objective`, `publishingStatus`, `source`, `specialAdCategories`, `unpublishedChanges`, `updatedAt`
  - collection: `adsets`
  - item fields: `ads`, `audience`, `budget`, `campaignId`, `conversionLocation`, `createdAt`, `fbAdSetId`, `fbError`, `id`, `instagramActorId`, `messagingPlatforms`, `name`, `pageId`, `publishingStatus`, `unpublishedChanges`, `updatedAt`

### fb-resume-adset

`POST /ad-publishing/facebook/adsets/{adSetId}/resume`

**Resume ad set.** Resume a paused Facebook ad set

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adSetId` | path | yes | string | Ad set identifier | "507f1f77bcf86cd799439012" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adSetId": "507f1f77bcf86cd799439012"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adsets`, `createdAt`, `fbAdAccountId`, `fbCampaignId`, `fbError`, `id`, `locationId`, `meta`, `name`, `objective`, `publishingStatus`, `source`, `specialAdCategories`, `unpublishedChanges`, `updatedAt`
  - collection: `adsets`
  - item fields: `ads`, `audience`, `budget`, `campaignId`, `conversionLocation`, `createdAt`, `fbAdSetId`, `fbError`, `id`, `instagramActorId`, `messagingPlatforms`, `name`, `pageId`, `publishingStatus`, `unpublishedChanges`, `updatedAt`

### fb-upsert-adset

`PUT /ad-publishing/facebook/adsets`

**Upsert adset.** Create or update a Facebook ad set

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `id` |  | string | Ad set identifier | "adset_123" |
| `name` |  | string | Ad set name | "Targeting Group A" |
| `pageId` |  | string | Facebook page ID | "123456789" |
| `instagramActorId` |  | string | Instagram actor ID | "ig_123" |
| `messagingPlatforms` |  | array<string> enum: `WHATSAPP`, `MESSENGER`, `INSTAGRAM_DIRECT` | Messaging platforms | ["WHATSAPP"] |
| `whatsappNumber` |  | string | WhatsApp phone number | "+1234567890" |
| `audience` |  | object — {geoLocations*: array, locales: array, placements: object, placementType: string enum: `auto`, `manual`, lookalike: array, retargeting: array, interests: array, ageMin: number, ageMax: number, genders: array} | Targeting audience configuration including geo-locations, locales, placements, and custom audiences | {"geoLocations": [{"key": "US", "name": "United States", "type": "country", "selectionType": "include"}], "ageMin": 18, "ageMax": 65, "genders": [1, 2]} |
| `budget` |  | object — {budgetType: string enum: `DAILY`, `LIFETIME`, amount: number, scheduleStartDate: string, scheduleEndDate: string} | Ad set budget config; schedule only under a campaign budget | {"budgetType": "DAILY", "amount": 1000, "scheduleStartDate": "2024-01-01", "scheduleEndDate": "2024-01-31"} |
| `bidAmount` |  | number | Bid cap or cost-per-result goal in account currency. Required when the campaign bid strategy is LOWEST_COST_WITH_BID_CAP or COST_CAP. | 2.5 |
| `conversionLocation` |  | string | Where the conversion happens. Valid values depend on the parent campaign objective — OUTCOME_LEADS: `on_ad` (instant form), `website`, `website_and_lead_form`; OUTCOME_SALES: `website` (pixel), `messaging`. Not validated server-side, so values outside this set are forwarded to Facebook and may be rejected there. | "website" |
| `customEventType` |  | string | Facebook standard event optimised for. Only meaningful when `conversionLocation` is `website` (requires `pixelId`). Valid values depend on the parent campaign objective — OUTCOME_LEADS: `COMPLETE_REGISTRATION`, `CONTACT`, `CONTENT_VIEW`, `FIND_LOCATION`, `LEAD`, `SCHEDULE`, `SEARCH`, `START_TRIAL`, `SUBMIT_APPLICATION`, `SUBSCRIBE`; OUTCOME_SALES: `ADD_PAYMENT_INFO`, `ADD_TO_CART`, `ADD_TO_WISHLIST`, `COMPLETE_REGISTRATION`, `CONTENT_VIEW`, `DONATE`, `INITIATED_CHECKOUT`, `PURCHASE`, `SEARCH`, `START_TRIAL`, `SUBSCRIBE`. Not validated server-side, so values outside this set are forwarded to Facebook and may be rejected there. | "PURCHASE" |
| `pixelId` |  | string | Conversion pixel ID | "px_123" |
| `campaignId` | yes | string | Parent campaign ID | "camp_123" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "name": "Ad Set 1",
      "pageId": "<facebook page id>",
      "instagramActorId": "<instagram actor id or omit>",
      "audience": {
        "geoLocations": [
          {
            "key": "US",
            "name": "United States",
            "type": "country",
            "selectionType": "include"
          }
        ],
        "genders": [
          0
        ],
        "ageMin": 18,
        "ageMax": 65,
        "locales": [
          {
            "key": 6,
            "name": "English (US)"
          }
        ],
        "interests": [],
        "placementType": "auto"
      },
      "budget": {
        "budgetType": "DAILY",
        "amount": 20
      },
      "campaignId": "<campaign id>"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `audience`, `budget`, `campaignId`, `conversionLocation`, `createdAt`, `fbAdSetId`, `fbError`, `id`, `instagramActorId`, `messagingPlatforms`, `name`, `pageId`, `publishingStatus`, `unpublishedChanges`, `updatedAt`
  - collection: `messagingPlatforms`

## Facebook / Instagram (Meta) — Ads

### fb-delete-ad

`DELETE /ad-publishing/facebook/ads/{adId}`

**Delete ad.** Delete a Facebook ad by ID

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439013" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439013"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-duplicate-ad

`POST /ad-publishing/facebook/ads/{adId}/duplicate`

**Duplicate ad.** Duplicate an existing Facebook ad

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439013" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439013"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adsetId`, `campaignId`, `createdAt`, `cta`, `description`, `descriptions`, `destinationFormId`, `destinationLink`, `fbAdId`, `fbError`, `headline`, `headlines`, `id`, `media`, `mediaType`, `multiAdvertiserAds`, `name`, `primaryText`, `primaryTexts`, `publishingStatus`, `unpublishedChanges`, `updatedAt`
  - collection: `descriptions`
  - item fields: `_id`, `text`

### fb-pause-ad

`POST /ad-publishing/facebook/ads/{adId}/pause`

**Pause ad.** Pause a running Facebook ad

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439013" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439013"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adsets`, `createdAt`, `fbAdAccountId`, `fbCampaignId`, `fbError`, `id`, `locationId`, `meta`, `name`, `objective`, `publishingStatus`, `source`, `specialAdCategories`, `unpublishedChanges`, `updatedAt`
  - collection: `adsets`
  - item fields: `ads`, `audience`, `budget`, `campaignId`, `conversionLocation`, `createdAt`, `fbAdSetId`, `fbError`, `id`, `instagramActorId`, `messagingPlatforms`, `name`, `pageId`, `publishingStatus`, `unpublishedChanges`, `updatedAt`

### fb-resume-ad

`POST /ad-publishing/facebook/ads/{adId}/resume`

**Resume ad.** Resume a paused Facebook ad

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439013" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439013"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adsets`, `createdAt`, `fbAdAccountId`, `fbCampaignId`, `fbError`, `id`, `locationId`, `meta`, `name`, `objective`, `publishingStatus`, `source`, `specialAdCategories`, `unpublishedChanges`, `updatedAt`
  - collection: `adsets`
  - item fields: `ads`, `audience`, `budget`, `campaignId`, `conversionLocation`, `createdAt`, `fbAdSetId`, `fbError`, `id`, `instagramActorId`, `messagingPlatforms`, `name`, `pageId`, `publishingStatus`, `unpublishedChanges`, `updatedAt`

### fb-upsert-ad

`PUT /ad-publishing/facebook/ads`

**Upsert ad.** Create or update a Facebook ad

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `id` |  | string | Ad identifier | "ad_123" |
| `name` |  | string | Ad name | "My Ad Creative" |
| `primaryText` |  | string | Single primary text. Normalised into `primaryTexts` when that array is empty, so send `primaryTexts` instead unless you have exactly one variant. | "Check out our offer!" |
| `headline` |  | string | Ad-level headline for CAROUSEL ads — used for any card that does not set its own `media[].headline`. SINGLE (image and video) ads take their headline from the `headlines` array instead. | "Great Deal" |
| `description` |  | string | Single ad description. SINGLE (image and video) ads take their description from the `descriptions` array, and carousel cards from `media[].description`. | "Limited time offer" |
| `imageUrl` |  | string | Ad image URL | "https://example.com/img.jpg" |
| `mediaType` |  | string enum: `SINGLE`, `CAROUSEL` | Ad media type | "SINGLE" |
| `media` |  | array<object> — items {src*: string, thumbnailUrl: string, selectedPoster: number, type*: string enum: `image`, `video`, name: string, headline: string, description: string, link: string} | Media items (images or videos) attached to the ad creative | [{"src": "https://example.com/image.jpg", "thumbnailUrl": "https://example.com/thumb.jpg", "selectedPoster": 0, "type": "IMAGE", "name": "ad_image.jpg"}] |
| `multiAdvertiserAds` |  | boolean | Enable multi-advertiser ads | false |
| `campaignId` | yes | string | Parent campaign ID | "camp_123" |
| `adsetId` | yes | string | Parent ad set ID | "adset_123" |
| `cta` |  | string | Call-to-action button. Valid values depend on the parent campaign objective (and, for sales, the ad set `conversionLocation`) — OUTCOME_LEADS: `APPLY_NOW`, `DOWNLOAD`, `GET_OFFER`, `GET_QUOTE`, `LEARN_MORE`, `SIGN_UP`, `SUBSCRIBE`; OUTCOME_TRAFFIC: `APPLY_NOW`, `BOOK_TRAVEL`, `BUY_NOW`, `CONTACT_US`, `GET_OFFER`, `GET_PROMOTIONS`, `GET_QUOTE`, `LEARN_MORE`, `NO_BUTTON`, `ORDER_NOW`, `SHOP_NOW`, `SIGN_UP`, `SUBSCRIBE`; OUTCOME_ENGAGEMENT: `APPLY_NOW`, `BOOK_TRAVEL`, `CONTACT_US`, `GET_PROMOTIONS`, `GET_QUOTE`, `INQUIRE_NOW`, `LEARN_MORE`, `MESSAGE_PAGE`, `ORDER_NOW`, `SEND_UPDATES`, `SHOP_NOW`, `SIGN_UP`, `SUBSCRIBE`; OUTCOME_SALES with `conversionLocation: messaging`: `APPLY_NOW`, `BOOK_TRAVEL`, `CONTACT_US`, `GET_QUOTE`, `LEARN_MORE`, `MESSAGE_PAGE`, `ORDER_NOW`, `PLAY_GAME`, `SHOP_NOW`, `SIGN_UP`, `SUBSCRIBE`; OUTCOME_SALES with `conversionLocation: website`: `APPLY_NOW`, `BOOK_TRAVEL`, `BUY_TICKETS`, `CONTACT_US`, `GET_OFFER`, `GET_QUOTE`, `GET_SHOWTIMES`, `LEARN_MORE`, `LISTEN_NOW`, `ORDER_NOW`, `PLAY_GAME`, `SHOP_NOW`, `SIGN_UP`, `SUBSCRIBE`, `WATCH_MORE`. Note `BOOK_TRAVEL` is the "Book now" button. Not validated server-side, so values outside this set are forwarded to Facebook and may be rejected there. | "LEARN_MORE" |
| `conversationFormId` |  | string | Conversation form ID | "conv_123" |
| `destinationLink` |  | string | Destination link URL | "https://example.com" |
| `destinationFormId` |  | string | Destination form ID | "form_123" |
| `primaryTexts` |  | array<object> — items {text*: string} | Primary text variants. Used by every media type. Supply more than one to run Facebook text variations; with a single entry it becomes the ad message. Prefer this over the singular `primaryText`. | [{"text": "Automation Test Primary Text"}] |
| `headlines` |  | array<object> — items {text*: string} | Headline variants. Applies to SINGLE (image and video) ads only — carousel ads take their per-card headline from `media[].headline`, falling back to the singular `headline`. Supply more than one to run Facebook text variations. | [{"text": "Automation Test Headline"}, {"text": "Automation Test Headline1"}] |
| `descriptions` |  | array<object> — items {text*: string} | Description variants. Applies to SINGLE (image and video) ads only — carousel ads take their per-card description from `media[].description`. Supply more than one to run Facebook text variations. | [{"text": "Automation Test Description"}] |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "campaignId": "camp_123",
      "adsetId": "adset_123"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adsetId`, `campaignId`, `createdAt`, `cta`, `description`, `descriptions`, `destinationFormId`, `destinationLink`, `fbAdId`, `fbError`, `headline`, `headlines`, `id`, `media`, `mediaType`, `multiAdvertiserAds`, `name`, `primaryText`, `primaryTexts`, `publishingStatus`, `unpublishedChanges`, `updatedAt`
  - collection: `descriptions`
  - item fields: `_id`, `text`

## Facebook / Instagram (Meta) — Entities (list)

### fb-get-entity

`GET /ad-publishing/facebook/entity`

**Get entities.** Retrieve campaigns, ad sets, or ads for a location. `entityType` selects which, and each returns a `{ data }` envelope whose item shape differs — the id key is `campaignId`, `adSetId`, or `adId` respectively, and the status fields differ too: campaigns carry both `status` and `effectiveStatus`, ad sets only `effectiveStatus`, and ads only `status`. `next` is returned only when the branch pages through Meta, so treat its absence as the end of the results rather than assuming a cursor. For `CAMPAIGN`, `type=INTEGRATION` queries Meta while `type=AD_MANAGER` reads campaigns this service published, filtered to `PAUSED` and `PUBLISHED`. `ADSET` requires `campaignId`; `AD` accepts `adSetId` for a single ad set or `campaignId` to page across the campaign.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adSetId` | query |  | string | Ad set identifier | "adset_123" |
| `campaignId` | query |  | string | Campaign identifier | "camp_123" |
| `entityType` | query | yes | string enum: `CAMPAIGN`, `ADSET`, `AD` | Entity type to fetch | "CAMPAIGN" |
| `fetchAll` | query |  | string | Fetch all entities | "true" |
| `next` | query |  | string | Pagination cursor | "cursor_abc" |
| `searchId` | query |  | string | Search identifier | "search_123" |
| `selectedAdAccountId` | query |  | string | Selected ad account ID | "act_123456" |
| `type` | query | yes | string enum: `AD_MANAGER`, `INTEGRATION` | Integration source type | "AD_MANAGER" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200

## Facebook / Instagram (Meta) — Lead forms

### fb-create-conversation-form

`POST /ad-publishing/facebook/conversation-forms`

**Create conversation form.** Create a Messenger conversation form. Note the created record is returned in its raw stored form rather than the shape the listing endpoint uses: the identifier comes back as `_id` instead of `id`, and the internal `__v` version key is included.

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `name` | yes | string | Conversation form name | "Welcome Form" |
| `text` | yes | string | Welcome message text | "Hi! How can we help?" |
| `questions` | yes | array<object> — items {question*: string, response: string} | Quick-reply questions shown in the welcome message of the conversation form | [{"question": "How can we help?", "response": "Thanks for reaching out! A team member will assist you shortly."}, {"question": "I want to learn more", "response": "Great! Here is a link to our services."}] |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "name": "Welcome chat",
      "text": "Hi! How can we help you today?",
      "questions": [
        {
          "question": "Get a quote",
          "response": "Great — what service are you interested in?"
        },
        {
          "question": "Talk to sales",
          "response": "A team member will reach out shortly."
        }
      ]
    }
  }
}
```

**Response**

- shape `object`, status 201
  - top-level keys: `__v`, `_id`, `createdAt`, `locationId`, `name`, `questions`, `text`, `updatedAt`
  - collection: `questions`
  - item fields: `_id`, `question`, `response`

### fb-create-page-lead-form

`POST /ad-publishing/facebook/page/{pageId}/forms`

**Create page lead form.** Create a lead gen form. With `isDraft: true` the form is stored locally and returned as a draft; without it the form is published to Facebook and the Meta record is returned. The two responses share almost no fields. Publishing enforces at least one question and a complete `thankYouPage` (title, body, buttonText) where a draft save enforces neither. Pass `draftFormId` when publishing an existing draft to have it deleted afterwards — either the bare id or the `draft_`-prefixed form is accepted, and cleanup failures are logged rather than surfaced.

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `pageId` | path | yes | string | Facebook page identifier | "103456789012345" |

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `type` | yes | string enum: `MORE_VOLUME`, `HIGHER_INTENT` | Lead form type | "MORE_VOLUME" |
| `name` | yes | string | Lead form name | "Contact Form" |
| `greetingCard` |  | object — {title*: string, style*: string enum: `LIST_STYLE`, `PARAGRAPH_STYLE`, content*: array} | Greeting card config | {"title": "Welcome!", "style": "LIST_STYLE", "content": ["Learn more about our services"]} |
| `questions` | yes | array<object> — items {label: string, key*: string, type*: string enum: `CUSTOM`, `CITY`, `COMPANY_NAME`, `COUNTRY`, `DOB`, `EMAIL`, `GENDER`, `FIRST_NAME`, `FULL_NAME`, `JOB_TITLE`, `LAST_NAME`, `MARITIAL_STATUS`, `WHATSAPP_NUMBER`, `EDUCATION_LEVEL`, `WEBSITE`, `PHONE`, `PHONE_OTP`, `POST_CODE`, `PROVINCE`, `RELATIONSHIP_STATUS`, `STATE`, `STREET_ADDRESS`, `ZIP`, `WORK_EMAIL`, `MILITARY_STATUS`, `WORK_PHONE_NUMBER`, `LOCAL_DEALER`, `SLIDER`, `STORE_LOOKUP`, `STORE_LOOKUP_WITH_TYPEAHEAD`, `DATE_TIME`, `ID_CPF`, `ID_AR_DNI`, `ID_CL_RUT`, `ID_CO_CC`, `ID_EC_CI`, `ID_PE_DNI`, `ID_MX_RFC`, `JOIN_CODE`, `USER_PROVIDED_PHONE_NUMBER`, `FACEBOOK_LEAD_ID`, `EMAIL_ALIAS`, `MESSENGER`, `VIN`, `LICENSE_PLATE`, `THREAD_LINK`, `ADDRESS_LINE_TWO`, `SHORT_ANSWER`, options: array} | List of questions displayed on the lead form. Required (non-empty) when `isDraft` is false or omitted; optional for drafts. | [{"key": "full_name", "type": "FULL_NAME"}, {"key": "email_address", "type": "EMAIL"}, {"key": "preferred_time", "type": "CUSTOM", "options": [{"key": "morning", "value": "Morning"}, {"key": "evening", "value": "Evening"}]}, {"key": "are_you_interested", "label": "Are you interested?", "type": "CUSTOM", "options": [{"value": "Yes"}, {"value": "No"}]}] |
| `questionPageHeadline` |  | string | Question page headline | "Tell us about yourself" |
| `privacyPolicyLink` | yes | string | Privacy policy URL. Required when `isDraft` is false or omitted; optional for drafts. | "https://example.com/privacy" |
| `privacyPolicyText` |  | string | Privacy policy text | "We respect your privacy" |
| `customDisclaimer` |  | object — {title*: string, body*: string, checkboxes: array} | Custom disclaimer config | {"title": "Terms & Conditions", "body": "By submitting...", "checkboxes": [{"isRequired": true, "text": "I agree", "key": "terms"}]} |
| `thankYouPage` | yes | object — {title*: string, body*: string, buttonText*: string, buttonType*: string enum: `VIEW_WEBSITE`, `CALL_BUSINESS`, `DOWNLOAD`, buttonLink: string, businessPhone: string, countryCode: string} | Thank you page config. Required when `isDraft` is false or omitted; optional for drafts. | {"title": "Thank You!", "body": "We will contact you soon", "buttonText": "Visit Website", "buttonType": "VIEW_WEBSITE", "buttonLink": "https://example.com"} |
| `isDraft` |  | boolean | If the form is a draft, set to true | true |
| `draftFormId` |  | string | Draft form ID | "1234567890" |
| `locale` |  | string | Locale | "EN_US" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "pageId": "103456789012345"
    },
    "query": {},
    "body": {
      "type": "MORE_VOLUME",
      "name": "Contact Form",
      "questions": [
        {
          "key": "name",
          "type": "CUSTOM",
          "label": "What is your name?",
          "options": [
            {
              "key": "option 1",
              "value": "Option 1"
            }
          ]
        }
      ],
      "privacyPolicyLink": "https://example.com/privacy",
      "thankYouPage": {
        "title": "Thank You!",
        "body": "We will contact you soon",
        "buttonText": "Visit Website",
        "buttonType": "VIEW_WEBSITE",
        "buttonLink": "https://example.com"
      }
    }
  }
}
```

**Response**

- shape `object`, status 201

### fb-get-conversation-forms

`GET /ad-publishing/facebook/conversation-forms`

**Get conversation forms.** Retrieve Facebook conversation lead forms for a location. Without `limit` the response is a plain array. When `limit` is provided (max 100) the response is a paginated `{ conversationForms, paging }` envelope; pass `after` (from `paging.next`) to fetch the next batch.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `after` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "25" |
| `limit` | query |  | string | Page size for a paginated fetch (max 100). When set, the response is a { conversationForms, paging } envelope instead of a plain array. | "25" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
    - item fields: `createdAt`, `id`, `locationId`, `name`, `questions`, `text`, `updatedAt`
  - shape `object`, status 200
    - top-level keys: `conversationForms`, `paging`
    - collection: `conversationForms`
    - item fields: `createdAt`, `id`, `locationId`, `name`, `questions`, `text`, `updatedAt`

### fb-get-lead-form

`GET /ad-publishing/facebook/lead-form/{leadFormId}`

**Get lead form by ID.** Retrieve a lead form by id. Pass `isDraft=true` to read an unpublished local draft instead, in which case `leadFormId` accepts either the bare id or the `draft_`-prefixed form the listing endpoint reports. The two branches return different shapes, and neither matches the shape the listing endpoint returns for the same form: the published branch carries the full Meta definition (context card, thank-you page, legal content) but no `status`, `createdTime`, or `pageId`, while the draft branch returns the stored document verbatim under `_id`.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `leadFormId` | path | yes | string | Lead form identifier | "507f1f77bcf86cd799439011" |
| `isDraft` | query |  | boolean | Fetch the unpublished draft of this lead form instead of the published form | true |

**payloadExample**

```json
{
  "params": {
    "path": {
      "leadFormId": "507f1f77bcf86cd799439011"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200

### fb-get-page-lead-forms

`GET /ad-publishing/facebook/page/{pageId}/forms`

**Get page lead forms.** Retrieve lead gen forms for a specific Facebook page (published + drafts), sorted newest-first by `createdTime`. By default each form is returned in full (including its `questions`) as a plain array; pass `projection` (comma-separated) to return only the requested fields — any value outside the known field set is rejected. Pass `limit` (max 100) for a `{ forms, paging }` envelope; use `after` (from `paging.next`) to fetch the next batch.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `pageId` | path | yes | string | Facebook page identifier | "103456789012345" |
| `after` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "25" |
| `limit` | query |  | string | Page size for a paginated fetch (max 100). When set, the response is a { forms, paging } envelope instead of a plain array. | "25" |
| `projection` | query |  | array<string> enum: `id`, `name`, `pageId`, `status`, `isDraft`, `createdTime`, `locale`, `page`, `questions` | Fields to return on each lead form, comma-separated (e.g. ?projection=name,id,pageId,status,isDraft,createdTime). When set, only the requested fields are returned; any other value is rejected. Omit to receive the full form (including questions) as-is. | ["name", "id", "pageId", "status", "isDraft", "createdTime"] |

**payloadExample**

```json
{
  "params": {
    "path": {
      "pageId": "103456789012345"
    },
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
  - shape `object`, status 200
    - top-level keys: `forms`, `paging`
    - collection: `forms`

## Facebook / Instagram (Meta) — Custom audiences

### fb-add-custom-audience-member

`PUT /ad-publishing/facebook/custom-audience/{customAudienceId}/member`

**Add custom audience member.** Add a single contact to a Facebook custom audience. The contact is resolved from `contactId` and its identifiers are hashed before being sent to Meta. Use the batch endpoint for more than one member.

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `customAudienceId` | path | yes | string | Custom audience identifier | "23851234567890123" |

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `contactId` | yes | string | Contact identifier | "contact_123" |
| `fbAdAccountId` |  | string | Facebook ad account ID | "act_123456" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "customAudienceId": "23851234567890123"
    },
    "query": {},
    "body": {
      "contactId": "contact_123"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `msg`, `status`

### fb-batch-update-audience-members

`PUT /ad-publishing/facebook/custom-audience/{customAudienceId}/member/batch`

**Batch update audience members.** Add or remove members in bulk from a Facebook custom audience, sourced from a CSV or one or more smart lists — at least one of `csvPath` or `smartlistIds` is required. The work is queued rather than performed inline, so the acknowledgement confirms only that the job was accepted; nothing about the outcome is reported here. Unlike the single-member endpoints this one answers with `{ success: true }` rather than a status-and-message body.

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `customAudienceId` | path | yes | string | Custom audience identifier | "23851234567890123" |

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `csvPath` |  | string | CSV file path | "/uploads/audience.csv" |
| `operationType` | yes | string enum: `ADD`, `REMOVE`, `REPLACE` | Batch operation type | "ADD" |
| `smartlistIds` |  | array<string> | Smartlist IDs array | ["list_1", "list_2"] |
| `dynamicAudience` |  | string | Dynamic audience flag | "true" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "customAudienceId": "23851234567890123"
    },
    "query": {},
    "body": {
      "operationType": "ADD"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-delete-custom-audience

`DELETE /ad-publishing/facebook/custom-audience/{customAudienceId}`

**Delete custom audience.** Delete a Facebook custom audience by ID

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `customAudienceId` | path | yes | string | Custom audience identifier | "23851234567890123" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "customAudienceId": "23851234567890123"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### fb-get-custom-audience-by-id

`GET /ad-publishing/facebook/custom-audience/{customAudienceId}`

**Get custom audience by ID.** Retrieve one custom audience with its full detail. Returns more than the listing endpoint: Meta adds the fields relevant to the audience subtype (`retentionDays` and `customerFileSource` for customer lists, `rule` and `pixelId` for website audiences, `lookalikeSpec` for lookalikes), and this service appends `extras` describing the local smart-list or CSV source when the audience is a user-provided customer list.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `customAudienceId` | path | yes | string | Custom audience identifier | "23851234567890123" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "customAudienceId": "23851234567890123"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `approximateCountLowerBound`, `approximateCountUpperBound`, `customerFileSource`, `dataSource`, `deliveryStatus`, `description`, `extras`, `id`, `lookalikeAudienceIds`, `lookalikeSpec`, `name`, `operationStatus`, `pixelId`, `retentionDays`, `rule`, `subtype`, `timeCreated`, `timeUpdated`
  - collection: `lookalikeAudienceIds`

### fb-get-custom-audiences

`GET /ad-publishing/facebook/custom-audience`

**Get custom audiences.** Retrieve Facebook custom audiences for a location. Without `limit` the response is a plain array. When `limit` is provided (max 100) the response is a paginated `{ customAudiences, paging }` envelope; pass `after` (from `paging.next`) to fetch the next batch. By default each item is returned in full; pass `projection` (comma-separated, dot-notation for nested fields, e.g. ?projection=id,name,dataSource.type) to return only the requested fields — any value outside the known field set is rejected.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adAccountId` | query | yes | string | Ad account identifier | "act_123456" |
| `after` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "QVFIU..." |
| `limit` | query |  | string | Page size for a paginated fetch (max 100). When set, the response is a { customAudiences, paging } envelope instead of a plain array. | "25" |
| `projection` | query |  | array<string> enum: `id`, `name`, `description`, `approximateCountLowerBound`, `approximateCountUpperBound`, `subtype`, `timeCreated`, `timeUpdated`, `dataSource`, `dataSource.type`, `dataSource.subType`, `dataSource.creationParams`, `deliveryStatus`, `deliveryStatus.code`, `deliveryStatus.description`, `operationStatus`, `operationStatus.code`, `operationStatus.description` | Fields to return on each item, comma-separated (e.g. ?projection=id,name,dataSource.type). When set, only the requested fields are returned. Nested fields use dot-notation; naming a parent (e.g. dataSource) returns the whole nested object. Any value outside the known field set is rejected. Omit the param entirely to receive the full item as-is. | ["id", "name", "dataSource.type", "deliveryStatus.code"] |
| `source` | query |  | string enum: `ad_manager`, `integration` | Audience data source | "ad_manager" |
| `type` | query | yes | string enum: `lookalike`, `custom`, `all` | Audience list type | "custom" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
    - item fields: `approximateCountLowerBound`, `approximateCountUpperBound`, `dataSource`, `deliveryStatus`, `description`, `id`, `name`, `operationStatus`, `subtype`, `timeCreated`, `timeUpdated`
  - shape `object`, status 200
    - top-level keys: `customAudiences`, `paging`
    - collection: `customAudiences`

### fb-remove-custom-audience-member

`DELETE /ad-publishing/facebook/custom-audience/{customAudienceId}/member`

**Remove custom audience member.** Remove a single contact from a Facebook custom audience. Note this DELETE takes a request body carrying `locationId` and `contactId`, rather than identifying the member through the path or query.

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `customAudienceId` | path | yes | string | Custom audience identifier | "23851234567890123" |

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `contactId` | yes | string | Contact identifier | "contact_123" |
| `fbAdAccountId` |  | string | Facebook ad account ID | "act_123456" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "customAudienceId": "23851234567890123"
    },
    "query": {},
    "body": {
      "contactId": "contact_123"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `msg`, `status`

### fb-update-custom-audience

`PUT /ad-publishing/facebook/custom-audience/{customAudienceId}`

**Update custom audience.** Rename a Facebook custom audience or change its description. Only those two fields can be updated; membership is changed through the member endpoints. The audience is also queued for reprocessing, so the acknowledgement does not mean downstream state has caught up.

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `customAudienceId` | path | yes | string | Custom audience identifier | "23851234567890123" |

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `name` | yes | string | Audience name | "My Custom Audience" |
| `description` |  | string | Audience description | "Lookalike audience from website visitors" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "customAudienceId": "23851234567890123"
    },
    "query": {},
    "body": {
      "name": "My Custom Audience"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `msg`, `status`

## Facebook / Instagram (Meta) — Pixels / conversions

### fb-get-pixels

`GET /ad-publishing/facebook/pixels`

**Get conversion pixels.** Retrieve Facebook conversion pixels for a location. `channel` selects between two unrelated behaviours. For `FACEBOOK` (the default) the response is `{ items, total }`, or a paginated `{ items, paging }` envelope when `limit` (max 100) is given — pass `after` from `paging.next` for the next batch — and `projection` (comma-separated, from `createdAt`, `fbIsCrmPixel`, `fbPixelCode`, `fbPixelId`, `name`, `type`) narrows each item. For `IG` the response is instead a bare array of Instagram datasets carrying only an id, and `limit`, `after`, and `projection` are ignored.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `after` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "QVFIU..." |
| `channel` | query |  | string enum: `IG`, `FACEBOOK` | Channel type | "FACEBOOK" |
| `igUserId` | query |  | string | Instagram user ID | "ig_user_123" |
| `limit` | query |  | string | Page size for a paginated fetch (max 100, FACEBOOK channel only). When set, the response is a { items, paging } envelope instead of { items, total }. | "25" |
| `pageId` | query |  | string | Facebook page ID | "123456789" |
| `projection` | query |  | array<string> enum: `createdAt`, `fbIsCrmPixel`, `fbPixelCode`, `fbPixelId`, `name`, `type` | Fields to return on each item, comma-separated (e.g. ?projection=name,fbPixelId). When set, only the requested fields are returned. Selectable fields: createdAt, fbIsCrmPixel, fbPixelCode, fbPixelId, name, type — any other value is rejected. Omit the param entirely to receive the full item as-is. | ["fbIsCrmPixel", "fbPixelCode"] |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `object`, status 200
    - top-level keys: `items`, `total`
    - collection: `items`
    - item fields: `createdAt`, `fbIsCrmPixel`, `fbPixelCode`, `fbPixelId`, `name`, `type`
  - shape `object`, status 200
    - top-level keys: `items`, `paging`
    - collection: `items`
    - item fields: `createdAt`, `fbIsCrmPixel`, `fbPixelCode`, `fbPixelId`, `name`, `type`
  - shape `array`, status 200
    - item fields: `id`

### fb-upsert-pixel

`PUT /ad-publishing/facebook/pixels`

**Upsert conversion pixel.** Create a Facebook conversion pixel, or rename an existing one by passing `conversionPixelId`. The two paths acknowledge differently: a create returns the new id, a rename returns only `{ success: true }`. Renaming is the only update supported, and it rejects `type: INSTAGRAM_DM`. Creating an `INSTAGRAM_DM` dataset requires `igUserId` and fails if one already exists for that account.

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `conversionPixelId` |  | string | Conversion pixel ID | "px_123" |
| `name` |  | string | Pixel name | "My Pixel" |
| `igUserId` |  | string | Instagram user ID | "ig_user_123" |
| `type` | yes | string enum: `LEAD_EVENT`, `FUNNEL_EVENT`, `INSTAGRAM_DM` | Pixel event type | "LEAD_EVENT" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "type": "LEAD_EVENT"
    }
  }
}
```

**Response**

- shape `object`, status 200

## Facebook / Instagram (Meta) — Targeting

### fb-search-targeting

`GET /ad-publishing/facebook/targeting/search`

**Search targeting options.** Search Facebook targeting options for ad set audience building. `type` selects which taxonomy is searched and determines the response shape: `geolocation` returns places, `interest` returns interests, behaviours, and demographics, and `language` returns locales. Geolocation and interest results are passed through from Facebook, so their fields are snake_case.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `query` | query | yes | string | Search query string | "fitness" |
| `searchType` | query |  | string | Specific search subtype | "adgeolocation" |
| `type` | query | yes | string enum: `geolocation`, `interest`, `language` | Targeting search type | "interest" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200

## Facebook / Instagram (Meta) — Reporting

### fb-get-campaign-reporting

`GET /ad-publishing/facebook/reporting/campaign/{campaignId}`

**Get campaign reporting.** Retrieve reporting for one campaign as a flat object, not the `{ grouped, totals }` envelope the account-level report uses. Merges the locally stored campaign, Meta insights for the window, and CDP-attributed contacts. The campaign must be published — one without an `fbCampaignId` is rejected. Note `results.lead` (Meta lead actions) and `leads` (CDP attributed contacts) measure different things and routinely disagree.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | path | yes | string | Campaign identifier | "507f1f77bcf86cd799439011" |
| `endDate` | query | yes | string | Report end date (YYYY-MM-DD) | "2022-01-31" |
| `startDate` | query | yes | string | Report start date (YYYY-MM-DD) | "2022-01-11" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignId": "507f1f77bcf86cd799439011"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `_id`, `campaignId`, `clicks`, `conversions`, `costPerConversion`, `costPerResult`, `costPerResultBreakdown`, `cpc`, `cpm`, `ctr`, `dateStart`, `dateStop`, `fbCampaignId`, `frequency`, `impressions`, `leads`, `name`, `objective`, `publishingStatus`, `reach`, `results`, `spend`, `startTime`, `stopTime`

### fb-get-reporting

`GET /ad-publishing/facebook/reporting`

**Get reporting data.** Retrieve aggregated Facebook ad reporting metrics for a location. `grouped` holds one row per `groupBy` period, or a single row covering the whole range when `groupBy` is omitted, and `totals` aggregates across them. Both objects only carry the metrics named in `fields`. Be aware that ratio metrics (`cpm`, `ctr`, `frequency`) are summed rather than weighted in `totals`, and that `cost_per_conversion` and `cost_per_result` are placeholders that always read `0` — their real values live under `costPerConversion` and `costPerResult`.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `endDate` | query | yes | string | Report end date (YYYY-MM-DD) | "2022-01-31" |
| `fields` | query | yes | array<string> enum: `impressions`, `clicks`, `spend`, `cpc`, `cost_per_conversion`, `conversions`, `results`, `cost_per_result`, `cpm`, `reach`, `frequency`, `ctr` | Reporting fields. Pass as comma-separated values on the wire (e.g. ?fields=impressions,clicks). | ["impressions", "clicks", "spend"] |
| `groupBy` | query |  | string enum: `day`, `week`, `month` | Time grouping interval | "month" |
| `startDate` | query | yes | string | Report start date (YYYY-MM-DD) | "2022-01-11" |
| `type` | query | yes | string enum: `AD_MANAGER`, `INTEGRATION` | Integration source type | "INTEGRATION" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `grouped`, `totals`
  - collection: `grouped`
  - item fields: `accountId`, `clicks`, `conversions`, `costPerConversion`, `costPerResultBreakdown`, `cpc`, `cpm`, `ctr`, `dateStart`, `dateStop`, `frequency`, `impressions`, `locationId`, `reach`, `results`, `spend`

### fb-get-reporting-list

`GET /ad-publishing/facebook/reporting/list`

**Get reporting list.** Retrieve campaigns, ad sets, or ads with their reporting metrics. `listType` selects the entity and changes the item shape; `adsets` and `ads` additionally require `campaignId`. Entities Meta has no insights for are still returned, padded with a fixed zero row that carries fewer fields than a real one. Note `none` is accepted by validation but has no handler and fails with a 409.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | query |  | string | Campaign identifier (required when listType is adsets or ads) | "196684453527082" |
| `endDate` | query | yes | string | Report end date (YYYY-MM-DD) | "2022-01-31" |
| `listType` | query | yes | string enum: `ads`, `adsets`, `campaigns`, `none` | Reporting list type | "campaigns" |
| `startDate` | query | yes | string | Report start date (YYYY-MM-DD) | "2022-01-11" |
| `type` | query | yes | string enum: `AD_MANAGER`, `INTEGRATION` | Integration source type | "INTEGRATION" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200

## Google Ads — Integration & account

### google-create-integration

`POST /ad-publishing/google/integration`

**Create Google integration.** Create a Google Ads integration for a location

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `adAccountId` | yes | string | Ad account identifier | "123-456-7890" |
| `mccId` | yes | string | MCC identifier | "987-654-3210" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "adAccountId": "<google ads customer id>",
      "mccId": "<manager id>"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `__v`, `_id`, `adAccountId`, `connectionId`, `createdAt`, `locationId`, `mccId`, `status`, `updatedAt`, `userId`

### google-delete-ad-account

`DELETE /ad-publishing/google/ad-accounts/{adAccountId}`

**Delete ad account.** Remove a Google Ads account connection from a location

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adAccountId` | path | yes | string | Ad account identifier | "act_abc123" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adAccountId": "act_abc123"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### google-get-ad-account-details

`GET /ad-publishing/google/ad-accounts/{adAccountId}`

**Get ad account details.** Retrieve details of a specific Google Ads account

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adAccountId` | path | yes | string | Ad account identifier | "act_abc123" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "adAccountId": "act_abc123"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `currencyCode`, `descriptiveName`, `email`, `id`, `paymentStatus`, `resourceName`, `status`

### google-get-ad-accounts

`GET /ad-publishing/google/ad-accounts`

**Get Google ad accounts.** Retrieve Google Ads accounts available for the connected user

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `email` | query |  | string | Google account email to match a connection against. Required when `type=EMAIL`. | "user@example.com" |
| `type` | query |  | string enum: `INTEGRATION`, `AD_MANAGER`, `EMAIL` (default `INTEGRATION`) | Account source to read. `INTEGRATION` walks the connected user's MCC tree, `AD_MANAGER` returns the stored ad-manager integrations, `EMAIL` resolves the Google connection matching `email`. Defaults to `INTEGRATION`. | "AD_MANAGER" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200

### google-get-current-user

`GET /ad-publishing/google/me`

**Get current Google user.** Retrieve the authenticated Google user info for a location

- kind: `read` · scopes: `adPublishing.readonly`

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `name`, `picture`

### google-get-integration

`GET /ad-publishing/google/integration`

**Get Google integration.** Retrieve the Google Ads integration details for a location

- kind: `read` · scopes: `adPublishing.readonly`

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adAccountId`, `createdAt`, `locationId`, `status`, `updatedAt`

## Google Ads — Campaigns

### google-get-campaign-by-id

`GET /ad-publishing/google/ads/{adId}`

**Get Google campaign by ID.** Retrieve a specific Google Ads campaign by ID

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439011" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439011"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adGroups`, `adSchedule`, `advertisingChannelType`, `assets`, `audience`, `biddingStrategy`, `budget`, `campaignGoal`, `createdAt`, `createdBy`, `googleAdAccountId`, `id`, `isEuPoliticalAds`, `locationId`, `meta`, `name`, `networkSettings`, `publishingStatus`, `source`, `unpublishedChanges`, `updatedAt`, `updatedBy`
  - collection: `adGroups`
  - item fields: `adCampaignId`, `adContent`, `adGroupError`, `audience`, `createdAt`, `customChannels`, `googleAdGroupId`, `googleAudienceId`, `id`, `keywords`, `name`, `publishingStatus`, `selectedChannels`, `updatedAt`

### google-get-publishing-progress

`GET /ad-publishing/google/ads/{adId}/publishing-progress`

**Get ad publishing progress.** Returns Redis-backed publish progress for a Google campaign while it is publishing. Used by the publish progress UI to poll step counts and completion state.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439011" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439011"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `campaignId`, `hasFailed`, `isComplete`, `processed`, `publishingStatus`, `total`

### google-publish-ad

`POST /ad-publishing/google/ads/{adId}/publish`

**Publish ad.** Publish a Google ad and push it live

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439011" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439011"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `__v`, `_id`, `adSchedule`, `advertisingChannelType`, `assets`, `audience`, `biddingStrategy`, `budget`, `createdAt`, `createdBy`, `googleAdAccountId`, `googleError`, `isEuPoliticalAds`, `locationId`, `meta`, `name`, `networkSettings`, `publishingStatus`, `source`, `updatedAt`, `updatedBy`
  - collection: `adSchedule`
  - item fields: `_id`, `dayOfWeek`, `from`, `to`

### google-upsert-campaign

`PUT /ad-publishing/google/ads`

**Upsert Google campaign.** Create or update a full Google Ads campaign structure

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `id` |  | string | Campaign identifier | "camp_abc123" |
| `name` | yes | string | Campaign name | "My Campaign" |
| `advertisingChannelType` | yes | string enum: `SEARCH`, `DEMAND_GEN` | Advertising channel. Only `SEARCH` and `DEMAND_GEN` campaigns can be built and published by this product; the other Google channels are readable on existing campaigns but cannot be created here. | "SEARCH" |
| `advertisingChannelSubType` |  | string enum: `DEMAND_GEN` | Channel sub type | "DEMAND_GEN" |
| `goalType` |  | string enum: `WEBSITE_TRAFFIC`, `LEAD` | Goal type | "WEBSITE_TRAFFIC" |
| `budget` |  | object — {budgetType: string enum: `DAILY`, `LIFETIME`, amount: number, scheduleStartDate: string, scheduleEndDate: string} | Campaign budget | {"budgetType": "DAILY", "amount": 5000, "scheduleStartDate": "2024-01-01"} |
| `audience` |  | object — {locales*: array, geoLocations*: array, gender: array, ageRange: array, segments: array, targetInterests: object} | Campaign audience targeting | {"geoLocations": [{"key": "geoTargetConstants/2840", "name": "United States"}]} |
| `networkSettings` |  | object — {targetSearchNetwork*: boolean, targetContentNetwork*: boolean} | Network settings | {"targetSearchNetwork": true, "targetContentNetwork": false} |
| `biddingStrategy` |  | object — {type: string, value: number} | Bidding strategy config | {"type": "MAXIMIZE_CONVERSIONS", "value": 1000000} |
| `assets` |  | object — {calls: array, sitelinks: array, leadForm: string, images: array, businessLogo: object} | Campaign assets | {"calls": ["customers/6776452901/assets/112233445"], "sitelinks": ["customers/6776452901/assets/112233446"], "images": ["customers/6776452901/assets/112233448"]} |
| `isEuPoliticalAds` |  | boolean | EU political ads flag | false |
| `adGroups` |  | array<object> — items {id: string, adGroupId: string, name: string, adCampaignId: string, adContent: array, keywords: object, publishingStatus: string enum: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `PUBLISHING`, `FAILED`, `IN_REVIEW`, `PAUSED`, `ARCHIVED`, `WITH_ISSUES`, `REJECTED`, adGroupError: string, googleAdGroupId: string, customChannels: boolean, selectedChannels: array, googleAudienceId: string, audience: object} | Campaign ad groups | [{"id": "ag_1", "name": "Ad Group 1", "adContent": [{"name": "Ad 1", "headlines": ["Buy Now"], "descriptions": ["Great products"]}]}] |
| `campaignGoal` |  | object — {type*: string enum: `CONVERSIONS`, `CLICK`, `YOUTUBE_ENGAGEMENT`, value: string, isCustomConversionGoal: boolean} | Campaign goal config | {"type": "WEBSITE_TRAFFIC", "isCustomConversionGoal": false} |
| `adSchedule` |  | array<object> — items {dayOfWeek*: string enum: `FRIDAY`, `MONDAY`, `SATURDAY`, `SUNDAY`, `THURSDAY`, `TUESDAY`, `UNKNOWN`, `UNSPECIFIED`, `WEDNESDAY`, `ALL_DAYS`, `MONDAY_TO_FRIDAY`, `SATURDAY_AND_SUNDAY`, from*: string, to*: string} | Ad schedule rules | [{"dayOfWeek": "MONDAY", "from": "09:00", "to": "17:00"}] |
| `publishingStatus` |  | string enum: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `PUBLISHING`, `FAILED`, `IN_REVIEW`, `PAUSED`, `ARCHIVED`, `WITH_ISSUES`, `REJECTED` | Publishing status | "PUBLISHED" |
| `googleAdAccountId` |  | string | Google Ad account identifier | "123-456-7890" |
| `unpublishedChanges` |  | boolean | Whether the campaign has unpublished changes | false |
| `maximumCpc` |  | number | Maximum CPC bid in micros | 2000000 |
| `googleCampaignId` |  | string | Google Ads campaign resource ID | "customers/123/campaigns/456" |
| `source` |  | string | Traffic source | "WEBSITE" |
| `advancedOptions` |  | object | Advanced options | {"source": "WEBSITE", "postId": "post_abc123"} |
| `customValueMappings` |  | object | User-provided overrides for custom_values merge tags used in ad copy | {"{{ custom_values.pet_name }}": "Fluffy"} |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "name": "My Search Campaign",
      "advertisingChannelType": "SEARCH",
      "budget": {
        "budgetType": "DAILY",
        "amount": 25,
        "scheduleStartDate": "2026-06-23",
        "scheduleEndDate": "2026-07-23"
      },
      "audience": {
        "geoLocations": [
          {
            "id": "2840",
            "key": "2840",
            "name": "United States",
            "resourceName": "geoTargetConstants/2840",
            "type": "country",
            "selectionType": "include"
          }
        ],
        "gender": [
          {
            "enum": "MALE",
            "negative": false
          }
        ],
        "ageRange": [
          {
            "enum": "AGE_RANGE_25_34",
            "negative": false
          }
        ],
        "locales": [
          {
            "name": "English",
            "id": "1000",
            "key": "1000",
            "resourceName": "languageConstants/1000"
          }
        ],
        "targetInterests": {
          "affinity": [
            "92946",
            "92508"
          ],
          "inMarket": []
        }
      },
      "networkSettings": {
        "targetSearchNetwork": true,
        "targetContentNetwork": false
      },
      "biddingStrategy": {
        "type": "MAXIMIZE_CLICKS"
      },
      "adGroups": [
        {
          "name": "Ad Group 1",
          "keywords": {
            "positives": [
              {
                "keyword": "digital marketing",
                "matchType": "BROAD"
              },
              {
                "keyword": "seo agency",
                "matchType": "PHRASE"
              },
              {
                "keyword": "hire seo consultant",
                "matchType": "EXACT"
              }
            ],
            "negatives": []
          },
          "adContent": [
            {
              "name": "Search Ad 1",
              "headlines": [
                "Buy Now",
                "Best Deals",
                "Shop Today"
              ],
              "descriptions": [
                "Great products at low prices",
                "Free shipping available"
              ],
              "finalUrl": "example.com"
            }
          ]
        }
      ],
      "adSchedule": [
        {
          "dayOfWeek": "MONDAY_TO_FRIDAY",
          "from": "09_00",
          "to": "17_00"
        }
      ],
      "googleAdAccountId": "123-456-7890",
      "source": "ASK_AI",
      "advancedOptions": {
        "source": "ASK_AI"
      }
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adGroups`, `adSchedule`, `advertisingChannelType`, `assets`, `audience`, `biddingStrategy`, `budget`, `campaignGoal`, `createdAt`, `createdBy`, `googleAdAccountId`, `id`, `isEuPoliticalAds`, `locationId`, `meta`, `name`, `networkSettings`, `publishingStatus`, `source`, `unpublishedChanges`, `updatedAt`, `updatedBy`
  - collection: `adGroups`
  - item fields: `adCampaignId`, `adContent`, `adGroupError`, `audience`, `createdAt`, `customChannels`, `googleAdGroupId`, `googleAudienceId`, `id`, `keywords`, `name`, `publishingStatus`, `selectedChannels`, `updatedAt`

## Google Ads — Entities (list)

### google-get-entity

`GET /ad-publishing/google/entity`

**Get entities.** Retrieve Google campaigns, ad groups, or ads based on entity type

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adGroupId` | query |  | string | Ad group identifier | "123456789" |
| `campaignId` | query |  | string | Campaign identifier | "196684453527082" |
| `endDate` | query |  | string | Filter end date | "2024-12-31" |
| `entityType` | query | yes | string enum: `CAMPAIGN`, `ADGROUP`, `AD` | Entity type | "CAMPAIGN" |
| `searchId` | query |  | string | Comma-separated Google Ads IDs to filter by | "123,456" |
| `selectedAdAccountId` | query |  | string | Selected ad account ID | "123-456-7890" |
| `startDate` | query |  | string | Filter start date | "2024-01-01" |
| `type` | query | yes | string enum: `AD_MANAGER`, `INTEGRATION` | Integration type | "AD_MANAGER" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `data`
  - collection: `data`

## Google Ads — Audiences & segments

### google-create-offline-user-list-job

`POST /ad-publishing/google/segments/offline-user-list-job`

**Create offline user list job.** Create a job to upload users to a Google customer match list

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `smartListIds` |  | array<string> | Smart list IDs | ["sl_123"] |
| `csvPath` |  | string | CSV file path | "/uploads/users.csv" |
| `userListId` |  | string | User list identifier | "ul_123" |
| `isDynamic` |  | boolean | Dynamic list flag | false |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "smartListIds": [
        "<smartListId>"
      ],
      "userListId": "<segment id>",
      "isDynamic": true
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### google-delete-segment

`DELETE /ad-publishing/google/segments/{segmentId}`

**Delete segment.** Delete a Google Ads audience segment by ID

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `segmentId` | path | yes | string | Segment identifier | "seg_abc123" |
| `type` | query | yes | string enum: `CUSTOM_SEGMENTS`, `DATA_SEGMENTS` | Segment type | "CUSTOM_SEGMENTS" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "segmentId": "seg_abc123"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### google-get-audience-by-id

`GET /ad-publishing/google/audiences/{audienceId}`

**Get audience by ID.** Retrieve a specific Google Ads combined audience by ID

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `audienceId` | path | yes | string | Audience identifier | "aud_abc123" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "audienceId": "aud_abc123"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `dimensions`, `exclusionDimension`, `id`, `name`, `resourceName`, `scope`, `status`

### google-get-audiences

`GET /ad-publishing/google/audiences`

**Get audiences.** Retrieve Google Ads combined audiences for a location. Without `limit` the response is a plain array. When `limit` is provided (max 100, default 100) the response is a paginated `{ audiences, paging }` envelope; pass `pageToken` (from `paging.next`) to fetch the next batch.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `limit` | query |  | string | Page size for a paginated fetch (max 100, defaults to 100). When set, the response is a { audiences, paging } envelope instead of a plain array. | "100" |
| `pageToken` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "100" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
    - item fields: `dimensions`, `exclusionDimension`, `id`, `name`, `resourceName`, `scope`, `status`
  - shape `object`, status 200
    - top-level keys: `audiences`, `paging`
    - collection: `audiences`
    - item fields: `dimensions`, `exclusionDimension`, `id`, `name`, `resourceName`, `scope`, `status`

### google-get-segment-by-id

`GET /ad-publishing/google/segments/{segmentId}`

**Get segment by ID.** Retrieve a specific Google Ads audience segment by ID

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `segmentId` | path | yes | string | Segment identifier | "seg_abc123" |
| `type` | query | yes | string enum: `CUSTOM_SEGMENTS`, `DATA_SEGMENTS` | Segment type | "CUSTOM_SEGMENTS" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "segmentId": "seg_abc123"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200

### google-get-segments

`GET /ad-publishing/google/segments`

**Get segments.** Retrieve Google Ads audience segments for a location. Without `limit` the response is a plain array. When `limit` is provided (max 100, default 100) the response is a paginated `{ segments, paging }` envelope; pass `pageToken` (from `paging.next`) to fetch the next batch.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `limit` | query |  | string | Page size for a paginated fetch (max 100, defaults to 100). When set, the response is a { segments, paging } envelope instead of a plain array. | "100" |
| `pageToken` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "100" |
| `type` | query |  | string enum: `CUSTOM_SEGMENTS`, `DATA_SEGMENTS`, `ALL` | Segment type | "CUSTOM_SEGMENTS" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
  - shape `object`, status 200
    - top-level keys: `paging`, `segments`
    - collection: `segments`

### google-upsert-audience

`PUT /ad-publishing/google/audiences`

**Upsert audience.** Create or update a Google Ads combined audience

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `resourceName` |  | string | Audience resource name | "customers/123/audiences/456" |
| `name` | yes | string | Audience name | "My Audience" |
| `dimensions` |  | object — {isAgeUnknown: boolean, ageRanges: array, genders: array, parentalStatuses: array, audienceSegments: object} | Audience dimensions | {"isAgeUnknown": false, "ageRanges": [{"minAge": 25, "maxAge": 34}], "genders": ["MALE", "FEMALE"]} |
| `exclusionDimension` |  | object — {isAgeUnknown: boolean, ageRanges: array, genders: array, parentalStatuses: array, audienceSegments: object} | Exclusion dimensions | {"genders": ["UNDETERMINED"]} |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "name": "Pricing viewers + parents 25-44",
      "dimensions": {
        "isAgeUnknown": true,
        "audienceSegments": {
          "customAudiences": [],
          "userLists": [
            "customers/1234567890/userLists/456"
          ],
          "userInterests": []
        },
        "genders": [
          "MALE",
          "FEMALE",
          "UNDETERMINED"
        ],
        "parentalStatuses": [
          "PARENT",
          "NOT_A_PARENT",
          "UNDETERMINED"
        ],
        "ageRanges": [
          {
            "minAge": 25,
            "maxAge": 44
          }
        ]
      },
      "exclusionDimension": {
        "audienceSegments": {
          "userLists": [
            "customers/1234567890/userLists/789"
          ]
        }
      }
    }
  }
}
```

**Response**

- shape `array`, status 200
  - item fields: `resourceName`

### google-upsert-segment

`PUT /ad-publishing/google/segments`

**Upsert segment.** Create or update a Google Ads audience segment

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `type` | query | yes | string enum: `CUSTOM_SEGMENTS`, `WEBSITE_VISITOR`, `CUSTOMER_MATCH`, `LOOKALIKE` | Segment type | "CUSTOM_SEGMENTS" |

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `name` | yes | string | Segment name | "My Segment" |
| `description` |  | string | Segment description | "Target audience segment" |
| `members` |  | array<object> — items {memberType*: string enum: `KEYWORD`, `URL`, `APP`, keyword: string, url: string, app: string} | Segment members — keywords, URLs, or apps that define the custom segment | [{"memberType": "KEYWORD", "keyword": "digital marketing"}, {"memberType": "URL", "url": "https://example.com"}, {"memberType": "APP", "app": "com.example.app"}] |
| `status` |  | string | Segment status | "ENABLED" |
| `type` |  | string | Google custom-audience type, used only when the `type` query parameter is `CUSTOM_SEGMENTS`. Defaults to `AUTO` when omitted. This is NOT the same field as the `type` query parameter, which selects which kind of segment to upsert — settable values here are `AUTO`, `INTEREST`, `PURCHASE_INTENT` and `SEARCH`. | "AUTO" |
| `id` |  | string | Segment identifier | "seg_123" |
| `membershipStatus` |  | string | Membership status | "OPEN" |
| `ruleBasedUserList` |  | object — {prepopulationStatus: string enum: `REQUESTED`, flexibleRuleUserList*: object} | Rule-based user list config | {"prepopulationStatus": "REQUESTED", "flexibleRuleUserList": {"inclusiveOperands": [{"lookbackWindowDays": 30, "rule": {"ruleItemGroups": [{"ruleItems": [{"name": "url__", "stringRuleItem": {"operator": "CONTAINS", "value": "/products"}}]}]}}], "exclusiveOperands": [{"lookbackWindowDays": 30, "rule": {"ruleItemGroups": [{"ruleItems": [{"name": "url__", "stringRuleItem": {"operator": "CONTAINS", "value": "/products"}}]}]}}]}} |
| `membershipLifeSpan` |  | number | Membership life span | 30 |
| `seedUserListIds` |  | array<string> | Seed user list IDs | ["list_1"] |
| `countryCodes` |  | array<string> | Country codes | ["US", "CA"] |
| `expansionLevel` |  | string enum: `BALANCED`, `BROAD`, `NARROW` | Expansion level | "BALANCED" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "name": "Home renovation intent",
      "members": [
        {
          "memberType": "KEYWORD",
          "keyword": "kitchen remodel"
        },
        {
          "memberType": "KEYWORD",
          "keyword": "bathroom renovation"
        },
        {
          "memberType": "URL",
          "url": "houzz.com"
        }
      ],
      "type": "SEARCH"
    }
  }
}
```

**Response**

- shape `object`, status 200

## Google Ads — Conversions

### google-delete-conversion

`DELETE /ad-publishing/google/conversions/{conversionId}`

**Delete conversion.** Delete a Google Ads conversion action by ID

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `conversionId` | path | yes | string | Conversion identifier | "123456789" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "conversionId": "123456789"
    },
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200
  - item fields: `resourceName`

### google-get-conversion-by-id

`GET /ad-publishing/google/conversions/{conversionId}`

**Get conversion by ID.** Retrieve a specific Google Ads conversion action by ID

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `conversionId` | path | yes | string | Conversion identifier | "123456789" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "conversionId": "123456789"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `attributionModelSettings`, `category`, `clickThroughLookbackWindowDays`, `countingType`, `id`, `includeInConversionsMetric`, `name`, `resourceName`, `status`, `type`, `valueSettings`, `viewThroughLookbackWindowDays`

### google-get-conversion-goals

`GET /ad-publishing/google/conversion-goals`

**Get conversion goals.** Retrieve Google Ads conversion goals for a location. Without `limit` the response is a plain array. When `limit` is provided (max 100, default 100) the response is a paginated `{ conversionGoals, paging }` envelope; pass `pageToken` (from `paging.next`) to fetch the next batch.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `limit` | query |  | string | Page size for a paginated fetch (max 100, defaults to 100). When set, the response is a { conversionGoals, paging } envelope instead of a plain array. | "100" |
| `pageToken` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "100" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
  - shape `object`, status 200
    - top-level keys: `conversionGoals`, `paging`
    - collection: `conversionGoals`

### google-get-conversions

`GET /ad-publishing/google/conversions`

**Get conversions.** Retrieve Google Ads conversion actions for a location. The response shape is selected by `type`. When `type` is `AD_MANAGER`: without `limit` a plain array of full conversion actions, and with `limit` (max 100, default 100) a paginated `{ conversions, paging }` envelope — pass `pageToken` (from `paging.next`) for the next batch. When `type` is omitted or `AD_WORDS`, a different, minimal snake_case projection is returned and `limit`, `pageToken`, `startDate`, `endDate`, `conversionType` and `category` are all ignored.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `category` | query |  | string enum: `DEFAULT`, `PAGE_VIEW`, `PURCHASE`, `SIGNUP`, `LEAD`, `DOWNLOAD`, `ADD_TO_CART`, `BEGIN_CHECKOUT`, `SUBSCRIBE_PAID`, `PHONE_CALL_LEAD`, `IMPORTED_LEAD`, `SUBMIT_LEAD_FORM`, `BOOK_APPOINTMENT`, `REQUEST_QUOTE`, `GET_DIRECTIONS`, `OUTBOUND_CLICK`, `CONTACT`, `ENGAGEMENT`, `STORE_VISIT`, `STORE_SALE`, `QUALIFIED_LEAD`, `CONVERTED_LEAD` | Conversion action category to filter by | "PURCHASE" |
| `conversionType` | query |  | string enum: `UPLOAD_CLICKS`, `UPLOAD_CALLS`, `WEBPAGE`, `LEAD_FORM_SUBMIT`, `AD_CALL` | Conversion action type to filter by | "WEBPAGE" |
| `endDate` | query |  | string | Filter end date | "2024-12-31" |
| `limit` | query |  | string | Page size for a paginated fetch (max 100, defaults to 100). When set, the response is a { conversions, paging } envelope instead of a plain array. Applies to AD_MANAGER type only. | "100" |
| `pageToken` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "100" |
| `startDate` | query |  | string | Filter start date | "2024-01-01" |
| `type` | query |  | string enum: `AD_MANAGER`, `AD_WORDS` | Integration type | "AD_MANAGER" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
    - item fields: `conversion_action_id`, `conversion_name`, `conversion_source`
  - shape `array`, status 200
    - item fields: `allConversions`, `allConversionsValue`, `category`, `countingType`, `defaultCurrencyCode`, `defaultValue`, `id`, `includeInConversionsMetric`, `name`, `primaryForGoal`, `resourceName`, `status`, `type`
  - shape `object`, status 200
    - top-level keys: `conversions`, `paging`
    - collection: `conversions`
    - item fields: `allConversions`, `allConversionsValue`, `category`, `countingType`, `defaultCurrencyCode`, `defaultValue`, `id`, `includeInConversionsMetric`, `name`, `primaryForGoal`, `resourceName`, `status`, `type`

### google-upsert-conversion

`PUT /ad-publishing/google/conversions`

**Upsert conversion.** Create or update a Google Ads conversion action

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `conversionId` |  | string | Conversion identifier | "conv_456" |
| `name` | yes | string | Conversion name | "Purchase Conversion" |
| `type` | yes | string enum: `UPLOAD_CLICKS` | Conversion action type. Only `UPLOAD_CLICKS` is supported — the conversion list endpoint reads back UPLOAD_CLICKS actions only, so a conversion created with any other type would never be returned. | "UPLOAD_CLICKS" |
| `category` | yes | string enum: `DEFAULT`, `PAGE_VIEW`, `PURCHASE`, `SIGNUP`, `LEAD`, `DOWNLOAD`, `ADD_TO_CART`, `BEGIN_CHECKOUT`, `SUBSCRIBE_PAID`, `PHONE_CALL_LEAD`, `IMPORTED_LEAD`, `SUBMIT_LEAD_FORM`, `BOOK_APPOINTMENT`, `REQUEST_QUOTE`, `GET_DIRECTIONS`, `OUTBOUND_CLICK`, `CONTACT`, `ENGAGEMENT`, `STORE_VISIT`, `STORE_SALE`, `QUALIFIED_LEAD`, `CONVERTED_LEAD` | Conversion action category | "PURCHASE" |
| `valueSettings` | yes | object — {defaultValue*: number, defaultCurrencyCode*: string, alwaysUseDefaultValue*: boolean} | Value settings that control how monetary value is attributed to conversions | {"defaultValue": "10.00", "defaultCurrencyCode": "USD", "alwaysUseDefaultValue": false} |
| `countingType` | yes | string enum: `ONE_PER_CLICK`, `MANY_PER_CLICK` | How conversions are counted per interaction | "ONE_PER_CLICK" |
| `attributionModel` | yes | string enum: `GOOGLE_SEARCH_ATTRIBUTION_DATA_DRIVEN`, `GOOGLE_ADS_LAST_CLICK` | Attribution model used to credit conversions | "GOOGLE_ADS_LAST_CLICK" |
| `clickThroughWindow` | yes | number | Click-through conversion window in days | 30 |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "name": "Purchase Conversion",
      "type": "UPLOAD_CLICKS",
      "category": "PURCHASE",
      "valueSettings": {
        "defaultValue": 10,
        "defaultCurrencyCode": "USD",
        "alwaysUseDefaultValue": false
      },
      "countingType": "ONE_PER_CLICK",
      "attributionModel": "GOOGLE_ADS_LAST_CLICK",
      "clickThroughWindow": 30
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `resourceName`

## Google Ads — Assets

### google-get-assets

`GET /ad-publishing/google/assets`

**Get assets.** Retrieve Google Ads creative assets for a location. Without `limit` the response is a plain array of assets. When `limit` is provided (max 100, default 100) the response is a paginated `{ assets, paging }` envelope; pass `pageToken` (from `paging.next`) to fetch the next batch.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `advertiserOnly` | query |  | string | Advertiser only flag | "true" |
| `id` | query |  | string | Asset identifier | "123456789" |
| `limit` | query |  | string | Page size for a paginated fetch (max 100, defaults to 100). When set, the response is a { assets, paging } envelope instead of a plain array. | "100" |
| `pageToken` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "100" |
| `type` | query | yes | string enum: `CALL`, `SITELINK` | Asset type to retrieve | "CALL" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
  - shape `object`, status 200
    - top-level keys: `assets`, `paging`
    - collection: `assets`

### google-upsert-assets

`POST /ad-publishing/google/assets`

**Upsert assets.** Create or update Google Ads creative assets

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `type` | yes | string enum: `CALL`, `SITELINK` | Asset type to create or update | "CALL" |
| `payload` | yes | object — {phoneNumber*: string, countryCode*: string, callConversionAction: string, adScheduleTargets: array, resourceName: string} **or** {resourceName: string, linkText*: string, finalUrls*: string, description1: string, description2: string, startDate: string, endDate: string, adScheduleTargets: array} | Asset payload — shape depends on the type field: CallAssetPayload (CALL) or SitelinkAssetPayload (SITELINK) | {"phoneNumber": "+14155551234", "countryCode": "US"} |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "type": "CALL",
      "payload": {
        "phoneNumber": "+14155551234",
        "countryCode": "US",
        "callConversionAction": "customers/123/conversionActions/456",
        "adScheduleTargets": [
          {
            "startMinute": "ZERO",
            "endMinute": "ZERO",
            "dayOfWeek": "MONDAY",
            "startHour": 9,
            "endHour": 17
          }
        ],
        "resourceName": "customers/123/assets/456"
      }
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `resourceName`

## Google Ads — Keywords

### google-get-keyword-ideas

`POST /ad-publishing/google/keyword-ideas`

**Get keyword ideas.** Retrieve keyword suggestions for Google Ads campaigns

- kind: `write` · scopes: `adPublishing.readonly` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `url` | yes | string | Target URL | "https://example.com" |
| `languageCode` |  | string | Language code | "en" |
| `locations` |  | array<string> | Target locations | ["US", "CA"] |
| `keywords` |  | array<string> | Seed keywords | ["marketing"] |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "url": "https://example.com"
    }
  }
}
```

**Response**

- shape `array`, status 200
  - item fields: `avgMonthlySearches`, `text`

## Google Ads — Targeting

### google-get-target-interests

`GET /ad-publishing/google/target-interests`

**Get target interests.** Retrieve affinity and in-market audience options for Google Ads targeting. Without `limit` the response is a plain array of root interests (each with a nested children tree). When `limit` is provided (max 100) the response is a paginated `{ targetInterests, paging }` envelope — a page counts root interests; pass `pageToken` (from `paging.next`) to fetch the next batch. By default each node is returned in full; pass `projection` (comma-separated, e.g. ?projection=name,userInterestId,children) to return only the requested fields — selecting `children` prunes the whole tree recursively with the same selection, and any value outside the known field set is rejected.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `advertisingChannelType` | query | yes | string | Channel type | "SEARCH" |
| `limit` | query |  | string | Page size for a paginated fetch (max 100). When set, the response is a { targetInterests, paging } envelope instead of a plain array. Counts root interests — each root includes its full children tree. | "100" |
| `pageToken` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "100" |
| `projection` | query |  | array<string> enum: `resourceName`, `taxonomyType`, `userInterestId`, `name`, `userInterestParent`, `availabilities`, `children` | Fields to return on each interest node, comma-separated (e.g. ?projection=name,userInterestId,children). When set, only the requested fields are returned. Selecting `children` prunes the whole tree recursively with the same selection; `availabilities` returns the whole array. Any value outside the known field set is rejected. Omit the param entirely to receive the full node as-is. | ["name", "userInterestId", "children"] |
| `type` | query | yes | string enum: `AFFINITY`, `IN_MARKET` | Interest type | "AFFINITY" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
  - shape `object`, status 200
    - top-level keys: `paging`, `targetInterests`
    - collection: `targetInterests`

### google-search-targeting

`GET /ad-publishing/google/targeting/search`

**Search targeting options.** Search Google geo-locations for ad targeting

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `query` | query |  | string | Search query | "New York" |
| `type` | query | yes | string enum: `geolocation`, `language` | Search type | "geolocation" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200

## Google Ads — Reporting

### google-get-campaign-reporting

`GET /ad-publishing/google/reporting/campaign/{campaignId}`

**Get campaign reporting.** Retrieve reporting metrics for a specific Google campaign

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | path | yes | string | Campaign identifier | "507f1f77bcf86cd799439011" |
| `endDate` | query | yes | string | Report end date | "2022-01-31" |
| `startDate` | query | yes | string | Report start date | "2022-01-11" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignId": "507f1f77bcf86cd799439011"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `campaignId`, `grouped`, `leads`, `name`, `objective`, `publishingStatus`, `startTime`, `stopTime`
  - collection: `grouped`
  - item fields: `campaign`, `metrics`, `segments`

### google-get-reporting

`GET /ad-publishing/google/reporting`

**Get reporting data.** Retrieve aggregated Google Ads reporting metrics for a location

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `endDate` | query | yes | string | Report end date | "2022-01-31" |
| `fields` | query | yes | array<string> enum: `impressions`, `clicks`, `cost_micros`, `average_cpc`, `conversions`, `average_cpm`, `cost_per_conversion`, `ctr` | Reporting fields. Pass as comma-separated values on the wire (e.g. ?fields=impressions,clicks). | ["impressions", "clicks", "cost_micros"] |
| `groupBy` | query |  | string enum: `date`, `week`, `month` | Group by period | "month" |
| `startDate` | query | yes | string | Report start date | "2022-01-11" |
| `type` | query | yes | string enum: `AD_MANAGER`, `INTEGRATION` | Integration type | "INTEGRATION" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `grouped`, `totals`
  - collection: `grouped`
  - item fields: `metrics`, `segments`

### google-get-reporting-list

`GET /ad-publishing/google/reporting/list`

**Get reporting list.** Retrieve a list of Google campaigns or ad groups with reporting data.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignId` | query |  | string | Campaign identifier (required when listType is adGroups, ads, or keywords) | "196684453527082" |
| `endDate` | query | yes | string | Report end date | "2022-01-31" |
| `listType` | query | yes | string enum: `campaigns`, `ads`, `adGroups`, `keywords` | Report list type | "campaigns" |
| `startDate` | query | yes | string | Report start date | "2022-01-11" |
| `type` | query | yes | string enum: `AD_MANAGER`, `INTEGRATION` | Integration type | "INTEGRATION" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200

## LinkedIn Ads — Integration & account

### li-create-integration

`POST /ad-publishing/linkedin/integration`

**Create LinkedIn integration.** Create a LinkedIn Ads integration for a location with ad account details

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `adAccountId` | yes | string | Ad account identifier | "12345678" |
| `adAccountName` | yes | string | Ad account name | "My Ad Account" |
| `currencyCode` | yes | string | Currency code | "USD" |
| `organizationId` | yes | string | Organization identifier | "12345678" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {
      "adAccountId": "<linkedin ad account id>",
      "adAccountName": "<account name>",
      "currencyCode": "USD",
      "organizationId": "<organization id>"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adAccountId`, `createdAt`, `currencyCode`, `locationId`, `organizationId`, `status`, `updatedAt`

### li-delete-ad-account

`DELETE /ad-publishing/linkedin/ad-account`

**Delete ad account.** Remove a LinkedIn ad account connection from a location.

- kind: `delete` · scopes: `adPublishing.write` · destructive · requires approval · idempotency key required

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adAccountId` | query | yes | string | Ad account identifier | "12345678" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### li-get-ad-account-details

`GET /ad-publishing/linkedin/ad-account`

**Get ad account details.** Retrieve details of a specific LinkedIn ad account.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adAccountId` | query | yes | string | Ad account identifier | "12345678" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `currency`, `id`, `name`, `organizationId`, `organizationLogo`, `servingStatuses`, `status`
  - collection: `servingStatuses`

### li-get-ad-accounts

`GET /ad-publishing/linkedin/ad-accounts`

**Get LinkedIn ad accounts.** Retrieve LinkedIn Ads accounts available for the connected user

- kind: `read` · scopes: `adPublishing.readonly`

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200
  - item fields: `currency`, `id`, `name`, `organizationId`, `servingStatuses`, `status`

### li-get-current-user

`GET /ad-publishing/linkedin/me`

**Get current LinkedIn user.** Retrieve the authenticated LinkedIn user info for a location

- kind: `read` · scopes: `adPublishing.readonly`

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `id`, `name`, `profilePicture`

### li-get-integration

`GET /ad-publishing/linkedin/integration`

**Get LinkedIn integration.** Retrieve the LinkedIn Ads integration details for a location

- kind: `read` · scopes: `adPublishing.readonly`

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adAccountId`, `createdAt`, `currencyCode`, `locationId`, `organizationId`, `status`, `updatedAt`

## LinkedIn Ads — Campaign groups

### li-get-campaign-group

`GET /ad-publishing/linkedin/ads/{adId}`

**Get ad campaign group.** Retrieve a LinkedIn ad campaign group by ID

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439011" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439011"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adBudgetOptimization`, `adCampaignGroupId`, `adCampaigns`, `budget`, `createdAt`, `createdBy`, `id`, `linkedInAdAccountId`, `linkedInError`, `locationId`, `meta`, `name`, `objectiveType`, `publishingStatus`, `unpublishedChanges`, `updatedAt`, `updatedBy`
  - collection: `adCampaigns`
  - item fields: `adCampaignGroupId`, `adCampaignId`, `ads`, `audience`, `campaignType`, `createdAt`, `id`, `linkedInError`, `locale`, `mediaType`, `name`, `publishingStatus`, `unitCost`, `updatedAt`

### li-publish-campaign-group

`POST /ad-publishing/linkedin/ads/{adId}/publish`

**Publish ad campaign group.** Publish a LinkedIn ad campaign group and push it live

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439011" |

**Request body**: none defined (send `{}`).

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439011"
    },
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### li-update-ad-status

`PATCH /ad-publishing/linkedin/{adId}/status`

**Update ad status.** Pause or resume a LinkedIn ad, campaign, or ad group.

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `adId` | path | yes | string | Ad identifier | "507f1f77bcf86cd799439011" |

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `operationType` | yes | string enum: `PAUSED`, `ARCHIVED`, `RESUME` | Update operation | "PAUSED" |
| `type` | yes | string enum: `adGroup`, `adCampaign`, `ad` | Ad object type | "adCampaign" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "adId": "507f1f77bcf86cd799439011"
    },
    "query": {},
    "body": {
      "operationType": "PAUSED",
      "type": "adCampaign"
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `success`

### li-upsert-campaign-group

`PUT /ad-publishing/linkedin/ads`

**Upsert ad campaign group.** Create or update a LinkedIn ad campaign group with campaigns and ads

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `id` |  | string | Internal ID | "cg_abc123" |
| `budget` |  | object — {budgetType*: string enum: `DAILY`, `LIFETIME`, amount*: number, scheduleStartDate: string, scheduleEndDate: string} | Campaign group budget | {"budgetType": "DAILY", "amount": 10000} |
| `adCampaigns` |  | array<object> — items {id: string, locale: object, name: string, publishingStatus: string enum: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `PUBLISHING`, `FAILED`, `IN_REVIEW`, `PAUSED`, `ARCHIVED`, `WITH_ISSUES`, `REJECTED`, mediaType: string enum: `STANDARD_UPDATE`, `SINGLE_VIDEO`, `CAROUSEL`, audience: object, unitCost: object, campaignType: string, adCampaignGroupId: string, adCampaignId: string, ads: array, linkedInError: string, meta: object} | Child ad campaigns | [{"name": "Campaign 1", "publishingStatus": "PUBLISHED"}] |
| `adBudgetOptimization` |  | string enum: `MAXIMUM_DELIVERY`, `COST_CAP` | Ad budget optimization mode | "MAXIMUM_DELIVERY" |
| `objectiveType` |  | string enum: `LEAD_GENERATION`, `WEBSITE_VISIT` | Campaign group objective | "LEAD_GENERATION" |
| `name` |  | string | Campaign group name | "Q1 Lead Gen" |
| `adCampaignGroupId` |  | string | LinkedIn campaign group resource ID | "123456789" |
| `publishingStatus` |  | string enum: `DRAFT`, `SCHEDULED`, `PUBLISHED`, `PUBLISHING`, `FAILED`, `IN_REVIEW`, `PAUSED`, `ARCHIVED`, `WITH_ISSUES`, `REJECTED` | Publishing status | "PUBLISHED" |
| `linkedInAdAccountId` |  | string | LinkedIn ad account identifier | "12345678" |
| `unpublishedChanges` |  | boolean | Whether the campaign group has unpublished changes | false |
| `meta` |  | object | Additional metadata | {} |
| `linkedInError` |  | string | LinkedIn API error message | "Budget below minimum" |
| `customValueMappings` |  | object | User-provided overrides for custom_values merge tags used in ad copy | {"{{ custom_values.pet_name }}": "Fluffy"} |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {},
    "body": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `adBudgetOptimization`, `adCampaignGroupId`, `adCampaigns`, `budget`, `createdAt`, `createdBy`, `id`, `linkedInAdAccountId`, `linkedInError`, `locationId`, `meta`, `name`, `objectiveType`, `publishingStatus`, `unpublishedChanges`, `updatedAt`, `updatedBy`
  - collection: `adCampaigns`
  - item fields: `adCampaignGroupId`, `adCampaignId`, `ads`, `audience`, `campaignType`, `createdAt`, `id`, `linkedInError`, `locale`, `mediaType`, `name`, `publishingStatus`, `unitCost`, `updatedAt`

## LinkedIn Ads — Lead forms

### li-create-lead-form

`POST /ad-publishing/linkedin/{accountId}/form`

**Create lead form.** Create a new LinkedIn lead gen form for an ad account.

- kind: `write` · scopes: `adPublishing.write` · requires approval · idempotency key required
- request: application/json

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `accountId` | path | yes | string | Account identifier | "12345678" |

**Request body**

| field | req | type | description | example |
|---|---|---|---|---|
| `owner` | yes | object — {sponsoredAccount*: string} | Form owner | {"sponsoredAccount": "urn:li:sponsoredAccount:123456"} |
| `creationLocale` | yes | object — {country*: string, language*: string} | Creation locale | {"country": "US", "language": "en"} |
| `name` | yes | string | Form name | "Contact Us" |
| `state` | yes | string enum: `PUBLISHED` | Form state | "PUBLISHED" |
| `content` | yes | object — {questions*: array, description: object, headline*: object, postSubmissionInfo*: object, legalInfo*: object} | Form content | {"questions": [{"name": "lastName", "label": "Last name", "responseRequired": true, "predefinedField": "LAST_NAME"}], "headline": {"localized": {"en_US": "Get in touch"}}, "postSubmissionInfo": {}, "legalInfo": {}} |
| `hiddenFields` |  | array<object> — items {name*: string, value*: string} | Hidden fields | [{"name": "utm_source", "value": "linkedin"}] |

**payloadExample**

```json
{
  "params": {
    "path": {
      "accountId": "12345678"
    },
    "query": {},
    "body": {
      "owner": {
        "sponsoredAccount": "urn:li:sponsoredAccount:123456"
      },
      "creationLocale": {
        "country": "US",
        "language": "en"
      },
      "name": "Contact Us",
      "state": "PUBLISHED",
      "content": {
        "questions": [
          {
            "question": {
              "localized": {
                "en_US": "First name"
              }
            },
            "name": "firstName",
            "questionDetails": {
              "textQuestionDetails": {}
            }
          }
        ],
        "headline": {
          "localized": {
            "en_US": "Get in touch"
          }
        },
        "postSubmissionInfo": {
          "message": {
            "localized": {
              "en_US": "Thank you!"
            }
          },
          "callToAction": {
            "callToActionTarget": {
              "landingPageUrl": "https://example.com/thank-you"
            },
            "callToActionLabel": "LEARN_MORE"
          }
        },
        "legalInfo": {
          "consents": [
            {
              "checkRequired": true,
              "id": 1,
              "consent": {
                "localized": {
                  "en_US": "I agree"
                }
              }
            }
          ],
          "privacyPolicyUrl": "https://example.com/privacy"
        },
        "description": {
          "localized": {
            "en_US": "Fill out this quick form"
          }
        }
      }
    }
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `content`, `created`, `creationLocale`, `hiddenFields`, `id`, `lastModified`, `name`, `owner`, `reviewInfo`, `state`, `versionId`
  - collection: `hiddenFields`
  - item fields: `name`, `value`

### li-get-lead-forms

`GET /ad-publishing/linkedin/{accountId}/forms`

**Get lead forms.** Retrieve LinkedIn lead gen forms for an ad account. By default each form is returned in full as a plain array; pass `projection` (comma-separated, dot-notation for nested fields) to return only the requested fields — any value outside the known field set is rejected. When `limit` is provided (max 100) the response is a paginated `{ leadForms, paging }` envelope; pass `pageToken` (from `paging.next`) to fetch the next batch.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `accountId` | path | yes | string | Account identifier | "12345678" |
| `limit` | query |  | string | Page size for a paginated fetch (max 100). When set, the response is a { leadForms, paging } envelope instead of a plain array. | "100" |
| `pageToken` | query |  | string | Opaque cursor for the next batch, taken from the previous response paging.next | "100" |
| `projection` | query |  | array<string> enum: `id`, `name`, `state`, `created`, `lastModified`, `versionId`, `creationLocale`, `owner`, `reviewInfo`, `reviewInfo.reviewStatus`, `reviewInfo.rejectionReasons`, `content`, `content.headline`, `content.questions`, `content.legalInfo`, `hiddenFields` | Fields to return on each lead form, comma-separated (e.g. ?projection=id,name,state,created,reviewInfo.reviewStatus). When set, only the requested fields are returned; any value outside the known field set is rejected. Nested fields use dot-notation (naming a parent like `reviewInfo` returns the whole object). Omit to receive the full form (including content.questions) as-is. | ["id", "name", "state", "created", "reviewInfo.reviewStatus"] |

**payloadExample**

```json
{
  "params": {
    "path": {
      "accountId": "12345678"
    },
    "query": {}
  }
}
```

**Response**

- shape `union` (one of):
  - shape `array`, status 200
    - item fields: `content`, `created`, `creationLocale`, `hiddenFields`, `id`, `lastModified`, `name`, `owner`, `reviewInfo`, `state`, `versionId`
  - shape `object`, status 200
    - top-level keys: `leadForms`, `paging`
    - collection: `leadForms`
    - item fields: `content`, `created`, `creationLocale`, `hiddenFields`, `id`, `lastModified`, `name`, `owner`, `reviewInfo`, `state`, `versionId`

## LinkedIn Ads — Targeting

### li-search-targeting

`GET /ad-publishing/linkedin/targeting/search`

**Search targeting options.** Search LinkedIn targeting facets such as locations, industries, and job titles

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `facet` | query | yes | string | Targeting facet | "locations" |
| `q` | query |  | string | Query parameter | "typeahead" |
| `query` | query |  | string | Search query | "software" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200
  - item fields: `facetUrn`, `name`, `urn`

## LinkedIn Ads — Reporting

### li-get-ad-analytics

`GET /ad-publishing/linkedin/reporting`

**Get ad analytics.** Retrieve LinkedIn Ads analytics data with configurable pivot and time grouping

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `endDate` | query | yes | string | End date in yyyy-mm-dd format | "2024-01-31" |
| `entityUrns` | query |  | string | Comma-separated list of entity URNs | "urn:li:sponsoredCampaign:123,urn:li:sponsoredCampaign:456" |
| `fields` | query |  | array<string> enum: `clicks`, `oneClickLeads`, `costInLocalCurrency`, `impressions`, `costInUsd`, `ctr`, `cpc`, `cpm`, `cpl`, `externalWebsitePostClickConversions`, `conversionRate` | Reporting fields. Pass as comma-separated values on the wire (e.g. ?fields=impressions,clicks). | ["impressions", "clicks", "costInUsd"] |
| `groupBy` | query |  | string enum: `day`, `month`, `year` (default `day`) | Time granularity for analytics | "day" |
| `pivot` | query |  | string enum: `ACCOUNT`, `CAMPAIGN`, `CAMPAIGN_GROUP`, `CREATIVE` (default `ACCOUNT`) | Analytics pivot type | "ACCOUNT" |
| `startDate` | query | yes | string | Start date in yyyy-mm-dd format | "2024-01-01" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `grouped`, `totals`
  - collection: `grouped`
  - item fields: `clicks`, `conversionRate`, `costInLocalCurrency`, `costInUsd`, `cpc`, `cpl`, `cpm`, `ctr`, `dateEnd`, `dateStart`, `externalWebsitePostClickConversions`, `impressions`, `oneClickLeads`, `pivotValues`

### li-get-campaign-group-reporting

`GET /ad-publishing/linkedin/reporting/campaign-group/{campaignGroupId}`

**Get campaign group reporting.** Retrieve reporting metrics for a specific LinkedIn campaign group

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignGroupId` | path | yes | string | Campaign group identifier | "12345678" |
| `campaignGroupId` | query | yes | string | Campaign group ID | "87654321" |
| `endDate` | query | yes | string | End date in yyyy-mm-dd format | "2024-01-31" |
| `fields` | query |  | array<string> enum: `clicks`, `oneClickLeads`, `costInLocalCurrency`, `impressions`, `costInUsd`, `ctr`, `cpc`, `cpm`, `cpl`, `externalWebsitePostClickConversions`, `conversionRate` | Reporting fields. Pass as comma-separated values on the wire (e.g. ?fields=impressions,clicks). | ["impressions", "clicks"] |
| `startDate` | query | yes | string | Start date in yyyy-mm-dd format | "2024-01-01" |

**payloadExample**

```json
{
  "params": {
    "path": {
      "campaignGroupId": "12345678"
    },
    "query": {}
  }
}
```

**Response**

- shape `object`, status 200
  - top-level keys: `__v`, `_id`, `adBudgetOptimization`, `adCampaignGroupId`, `budget`, `clicks`, `conversionRate`, `costInLocalCurrency`, `costInUsd`, `cpc`, `cpl`, `cpm`, `createdAt`, `ctr`, `dateEnd`, `dateStart`, `externalWebsitePostClickConversions`, `impressions`, `linkedInAdAccountId`, `linkedInError`, `locationId`, `name`, `objectiveType`, `oneClickLeads`, `pivotValues`, `publishingStatus`, `updatedAt`
  - collection: `pivotValues`

### li-get-reporting-list

`GET /ad-publishing/linkedin/reporting/list`

**Get reporting list.** Retrieve a list of LinkedIn campaigns or campaign groups with reporting data.

- kind: `read` · scopes: `adPublishing.readonly`

**Parameters**

| name | in | req | type | description | example |
|---|---|---|---|---|---|
| `campaignGroupId` | query | yes | string | Campaign group ID | "87654321" |
| `campaignId` | query | yes | string | Campaign ID | "12345678" |
| `endDate` | query | yes | string | End date in yyyy-mm-dd format | "2024-01-31" |
| `fields` | query |  | array<string> enum: `clicks`, `oneClickLeads`, `costInLocalCurrency`, `impressions`, `costInUsd`, `ctr`, `cpc`, `cpm`, `cpl`, `externalWebsitePostClickConversions`, `conversionRate` | Reporting fields. Pass as comma-separated values on the wire (e.g. ?fields=impressions,clicks). | ["impressions", "clicks"] |
| `listType` | query | yes | string enum: `campaignGroups`, `campaigns`, `ads` | List type | "campaigns" |
| `startDate` | query | yes | string | Start date in yyyy-mm-dd format | "2024-01-01" |

**payloadExample**

```json
{
  "params": {
    "path": {},
    "query": {}
  }
}
```

**Response**

- shape `array`, status 200
  - item fields: `_id`, `adCampaignGroupId`, `adCampaignId`, `adId`, `campaignName`, `clicks`, `conversionRate`, `costInLocalCurrency`, `costInUsd`, `cpc`, `cpl`, `cpm`, `ctr`, `dateEnd`, `dateStart`, `externalWebsitePostClickConversions`, `impressions`, `name`, `oneClickLeads`, `pivotValues`, `publishingStatus`
