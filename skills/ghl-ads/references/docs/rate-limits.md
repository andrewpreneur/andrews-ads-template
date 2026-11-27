# Rate Limits

Source: https://marketplace.gohighlevel.com/docs/other/rate-limits

HighLevel applies rate limits to the public API 2.0 endpoints authenticated with OAuth, to keep performance and stability predictable for everyone.

## The limits

Limits are counted **per Marketplace app (client) per resource** — a resource being a single Location (sub-account) or Company (agency).

| Limit | Allowance | Window |
| --- | --- | --- |
| Burst | 100 API requests | per 10 seconds |
| Daily | 200,000 API requests | per 24 hours |

Because the quota is scoped per app *per resource*, installing on more sub-accounts does not divide your allowance — each install gets its own budget.

> **Example.** `GHL-APP` is installed on two sub-accounts, A and B. Against sub-account A it may make 200,000 requests per day and 100 requests per 10 seconds; against sub-account B it may make the same again, independently.

The limits above are the defaults. Limits can be set differently for specific apps, locations, companies or Private Integrations, so `X-RateLimit-Max` and `X-RateLimit-Limit-Daily` always show the limits applied to your request.

### Private Integration tokens

Requests made with a [Private Integration](../Authorization/PrivateIntegrationsToken.md) token get the same default limits, headers and 429 response, but they are counted differently:

- **Burst limit:** counted per Private Integration per location or company. Rotating a Private Integration's token keeps the same burst counter.
- **Daily limit:** counted per location or company. All Private Integration tokens of the same location or company share one daily counter. Marketplace apps installed on that location or company keep their own counters.

> **Example.** Two Private Integrations on sub-account A can each send 100 requests per 10 seconds, but together they share one budget of 200,000 requests per 24 hours. If one of them uses 150,000, the other has 50,000 left in that window.

## How the windows reset

Both limits use fixed windows that start with the first counted request. They are not aligned to the clock and do not slide.

- **Burst limit:** a 10-second window (`X-RateLimit-Interval-Milliseconds`) that starts with the first counted request. When the window ends, the burst count starts again from zero.
- **Daily limit:** a fixed 24-hour window that starts with the first counted request (it does not slide and is not a calendar day, so it does not reset at midnight in any time zone). Because the next window starts with your next request after a reset, the reset time moves from day to day. `X-RateLimit-Daily-Reset` gives the milliseconds left in the current window.

Only allowed requests are counted. A request rejected with a 429 does not count against either limit and does not extend either window.

## Rate limit headers

Every response to a rate-limited request, including a 429, carries headers describing your current position against both limits. Read them rather than counting requests yourself — they are authoritative.

| Header | Limit | Meaning | Default / example |
| --- | --- | --- | --- |
| [`X-RateLimit-Limit-Daily`](#x-ratelimit-limit-daily) | Daily | Your daily limit | `200000` |
| [`X-RateLimit-Daily-Remaining`](#x-ratelimit-daily-remaining) | Daily | Requests remaining for the day | `199850` |
| [`X-RateLimit-Daily-Reset`](#x-ratelimit-daily-reset) | Daily | Milliseconds until the daily limit resets | `52341000` |
| [`X-RateLimit-Interval-Milliseconds`](#x-ratelimit-interval-milliseconds) | Burst | The time interval for burst requests | `10000` |
| [`X-RateLimit-Max`](#x-ratelimit-max) | Burst | The maximum request limit in that interval | `100` |
| [`X-RateLimit-Remaining`](#x-ratelimit-remaining) | Burst | Requests remaining in the current interval | `97` |

A typical set of headers on a successful response:

```text
X-RateLimit-Limit-Daily: 200000
X-RateLimit-Daily-Remaining: 199850
X-RateLimit-Daily-Reset: 52341000
X-RateLimit-Max: 100
X-RateLimit-Remaining: 97
X-RateLimit-Interval-Milliseconds: 10000
```

### `X-RateLimit-Limit-Daily`

The maximum number of requests allowed in one 24-hour daily window. The default is `200000`. If a custom daily limit applies to your app, location, company or Private Integration, this header shows that value instead.

### `X-RateLimit-Daily-Remaining`

How many more requests you can make in the current daily window. The value already counts the request it is returned on: a request that receives `X-RateLimit-Daily-Remaining: 0` succeeded, and the next request is rejected until the daily window resets.

On a 429, `0` means the daily limit was reached. For Private Integration tokens this is the counter shared by every Private Integration on the location or company, so it also goes down when the other Private Integrations make requests.

### `X-RateLimit-Daily-Reset`

The number of milliseconds until the current daily window ends and `X-RateLimit-Daily-Remaining` returns to the full `X-RateLimit-Limit-Daily`.

- It is a duration, not a timestamp. Add it to the time you received the response to get the reset time.
- It has one-second precision, so the value is always a multiple of `1000`.
- When no daily window is running yet, it reports the full window, `86400000` (24 hours), and the window starts with that request.

### `X-RateLimit-Max`

The maximum number of requests allowed in one burst interval. The default is `100`. If a custom burst limit applies to your app, location, company or Private Integration, this header shows that value instead.

### `X-RateLimit-Remaining`

How many more requests you can make in the current 10-second burst window. Like `X-RateLimit-Daily-Remaining`, it already counts the request it is returned on.

On a 429, `0` means the burst limit was reached. For Private Integration tokens it is counted per Private Integration per location or company.

### `X-RateLimit-Interval-Milliseconds`

The length of the burst window in milliseconds. It is always `10000` (10 seconds).

This is the length of the window, not the time left in it. No header reports the time left in the current burst window, so when the burst limit is reached, wait the full interval before retrying.

## What happens when a rate limit is exceeded

When a request would go over the burst limit or the daily limit, it is rejected before the endpoint runs. You get HTTP status `429 Too Many Requests` with this JSON body:

```json
{
  "statusCode": 429,
  "message": "Too Many Requests"
}
```

- A rejected request is not counted against either limit.
- The response does not include a `Retry-After` header. Use the rate-limit headers above instead; they are also sent on the 429 response.
- `X-RateLimit-Remaining` is `0` when the burst limit was reached, and `X-RateLimit-Daily-Remaining` is `0` when the daily limit was reached.
- Detect a rate-limit rejection by the `429` status code, not by the text of the body.

### How to back off after a 429

1. If `X-RateLimit-Daily-Remaining` is `0`, wait `X-RateLimit-Daily-Reset` milliseconds before retrying.
2. Otherwise, if `X-RateLimit-Remaining` is `0`, wait `X-RateLimit-Interval-Milliseconds` (10,000 ms) before retrying.
3. Retrying sooner returns another 429 until the window resets.

## Staying within the limits

- **Throttle before you hit the limit.** When `X-RateLimit-Remaining` gets low, pause until the burst window ends instead of waiting for a 429.
- **Share one limiter per counter.** All workers that call the API for the same app install, or with the same Private Integration, draw from the same counters. Coordinate them through one shared limiter rather than letting each one send at full speed.
- **Pace long-running jobs.** Spread bulk imports and syncs over the day, and use `X-RateLimit-Daily-Remaining` and `X-RateLimit-Daily-Reset` to plan how fast to go.
- **Prefer webhooks to polling.** Where your app can receive webhooks, use them to learn about changes instead of re-reading data on a schedule.
