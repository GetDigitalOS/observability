# External Observability Tools

Tools that complement the `@getdigitalos/observability` package but don't ship as code. These are configured via their own dashboards or run ad-hoc.

---

## Better Stack Uptime — External uptime monitoring + status page

Better Stack pings your URLs from external locations, alerts on downtime, and hosts a public status page. No code integration — configure via their dashboard at [betterstack.com](https://betterstack.com).

> **Decision (2026-04-28):** Better Stack replaced UptimeRobot as our uptime monitoring + status page tool. See "Why Better Stack over UptimeRobot" below for the cost/feature analysis. UptimeRobot section preserved at the bottom of this doc as historical reference.

### Free-tier coverage

- **10 monitors** (we currently use ~7)
- **10 heartbeats** (cron / serverless job monitoring)
- **1 status page** with custom-branded subdomain
- **3-minute check interval**
- **Playwright transaction monitoring** — real Chrome browser interaction tests
- **Screenshots + traceroute + MTR** captured on failure
- **SSL/domain expiration monitoring**
- Multi-channel alerts: SMS, email, Slack, Teams, push

### TOS verified (2026-04-28)

Better Stack's Terms of Use contain **no clause** restricting the free tier to personal/non-commercial use. The "Free for personal projects" line on the pricing page is marketing copy, not an enforced restriction. Free tier is usable for our commercial workloads.

### Adding a monitor

1. Log in at [betterstack.com](https://betterstack.com)
2. **Monitors → Create monitor**
3. Configure:
   - **Monitor type:** `HTTP / website` (or `Keyword` for body content checks)
   - **Name:** `{project-name} — Production`
   - **URL:** Health endpoint (see table below)
   - **Check frequency:** 3 minutes (free-tier max — fine for our SLO)
   - **Request timeout:** 30 seconds
   - **Verify SSL:** On
   - **On-call escalation policy:** start with the default; switch to a paid Responder seat only when on-call rotations become a real need
4. **Alert me when:** site is down for **2 consecutive checks** (avoids single-blip noise)
5. Save

### Health endpoints by project

| Project | Full URL | Type | Expected body keyword |
|---|---|---|---|
| Conduit | `https://conduit-production-f80c.up.railway.app/api/health` | HTTP + Keyword | `"status":"ok"` |
| ActFast | `https://app-actfast.steep-band-be51.workers.dev/` | HTTP | — |
| GoldenThread | `https://app-goldenthread.steep-band-be51.workers.dev/` | HTTP | — |
| HEA Platform (Web) | `https://hea-web-production.up.railway.app/` | HTTP | — |
| HEA Platform (API) | `https://hea-web-production.up.railway.app/api/v1/health` | HTTP + Keyword | `"status":"ok"` (verify endpoint exists) |
| MyLTCInsurance | `https://website-myltcinsurance.pages.dev/` | HTTP | — |
| Habanero Shaker | `https://website-habaneroshaker.pages.dev/` | HTTP | — |

### Recommended monitor types

- **HTTP** — Primary: checks URL returns 2xx
- **Keyword** — Secondary (only for projects with a structured health endpoint): asserts a specific string in the response body. Use sparingly — each Keyword monitor consumes one of the 10 free slots.
- **Heartbeat** — For cron jobs and BullMQ workers: your app pings Better Stack on success; an alert fires if no ping arrives within the expected interval.

### Status page

- One status page included on the free tier, hosted on a custom subdomain.
- Add each monitor as a component on the same page rather than creating one page per project — additional public status pages are $12/mo (annual).
- Status page URL: TBD once provisioned.

### When to upgrade past free

| Trigger | Upgrade |
|---|---|
| Need on-call rotations / incident escalation | $29/mo annual (1 Responder seat) |
| >10 active monitors | +50-monitor pack at $21/mo annual |
| Need a separate status page per brand/customer | +$12/mo annual per page |
| Need <3-minute check intervals | $29/mo annual seat unlocks 30s checks |

None of these are hit yet. Document any upgrade in this section so the cost is traceable.

### API automation (future)

Better Stack has a REST API for monitor and status-page management. A future `hub` command could read `registry/projects.json` and auto-provision monitors. Defer until manual setup proves the workflow.

### Why Better Stack over UptimeRobot

| Concern | UptimeRobot Free | Better Stack Free |
|---|---|---|
| Monitors | 50 | 10 (sufficient for current scale) |
| Check frequency | 5 min | **3 min** |
| Custom-branded status page | Pro ($7/mo) | **Free** |
| Cron / heartbeat monitoring | No | **10 heartbeats included** |
| Playwright transaction tests | No | **Yes** |
| Screenshot + MTR on failure | No | **Yes** |
| Cost for our 7-monitor commercial workload | $0 | $0 |

UptimeRobot wins on raw monitor count (50 vs 10), but every other dimension favors Better Stack at our scale, including capabilities we'd otherwise pay for. The 10-monitor ceiling is a real constraint to track — when we cross it, the upgrade math is $21/mo for +50 monitors, which is still cheaper than UptimeRobot's $29/mo Team plan and includes more features.

---

## Better Stack Telemetry — Deferred decision

Better Stack also sells a separate **Telemetry** product (logs, metrics, OTel-native traces with eBPF instrumentation, error tracking). On paper it overlaps with **Dash0** (traces + metrics) and **Sentry** (errors).

**We have not adopted it.** Reasoning:

1. We deliberately split Sentry and Dash0 by role (see "Sentry vs. Dash0" below). Unwinding that on the same day to chase single-vendor consolidation would be premature.
2. Better Stack's error-tracking claim ("Catch bugs, get root cause") is a vendor marketing line we have not verified — same skepticism we applied to Dash0's Sentry-alternative pitch.
3. Telemetry is a separate paid product. "Fewer vendors" is not automatically cheaper; consolidation math requires comparing actual bills.

**Revisit triggers:**

- Better Stack Uptime proves materially better in real use over 4–8 weeks → earns the deeper Telemetry evaluation.
- Dash0 or Sentry pricing crosses a threshold where consolidation pays for itself.
- Better Stack publishes credible feature parity on error grouping, source maps, release health, and session replay.

Until then, the answer to "should we move logs/metrics/errors to Better Stack Telemetry?" is **not yet — separate evaluation required**.

---

## UptimeRobot — Historical reference (deprecated 2026-04-28)

Replaced by Better Stack Uptime (see above). Account and existing monitors retained as a temporary fallback during the migration window. Decommission UptimeRobot account once all Better Stack monitors have run cleanly for 2 weeks.

UptimeRobot's REST API was previously considered for `hub`-based auto-provisioning. That capability now belongs to Better Stack — see "API automation (future)" above.

---

## WebPageTest (by Catchpoint) — Ad-hoc performance forensics

Use WebPageTest when Lighthouse flags an issue and you need deeper detail, or when you want to test performance from a specific geographic region. This is a complement to Lighthouse CI, not a replacement.

> **Note (2026-04):** WebPageTest is now part of Catchpoint. The dashboard is at [portal.catchpoint.com](https://portal.catchpoint.com/) and the API docs are at [docs.catchpoint.com/wptpro/docs/rest-api-1](https://docs.catchpoint.com/wptpro/docs/rest-api-1). The classic `webpagetest.org` still works as a public test runner, but account / API access goes through the Catchpoint portal.

### When to use

- **After Lighthouse CI flags regression** — WebPageTest gives you filmstrips, waterfalls, and per-request timing that Lighthouse summarizes into a single score.
- **Testing from non-US locations** — LCP can be 3× worse from Sydney or Mumbai vs. US-East. Lighthouse only tests from the CI runner's location.
- **Competitor benchmarking** — run your URL vs. competitor URL side-by-side, filmstrip comparison.
- **Investor/sales demos** — the filmstrip visualization is compelling for non-technical audiences.

### Starter (free) plan

- **150 test runs/month** via the portal or API
- Locations include Dulles (VA), London (UK), plus additional via "Other Locations"
- Devices: Desktop Chrome, iPhone 15, iPad, iPhone 14 Pro, plus others
- Performance tests + Lighthouse tests (integrated, same dashboard)
- Sign up at [portal.catchpoint.com](https://portal.catchpoint.com/)

### Usage

**Interactive (dashboard):** [portal.catchpoint.com](https://portal.catchpoint.com/) → **Instant Tests** → paste URL → choose device/location → **Run Test**.

**API (for scripted tests):**
```bash
curl -H "x-api-key: YOUR_API_KEY" \
  "https://www.webpagetest.org/runtest.php?url=https://your-site.com&f=json"
```

API key is generated in the Catchpoint portal. Full REST reference: [docs.catchpoint.com/wptpro/docs/rest-api-1](https://docs.catchpoint.com/wptpro/docs/rest-api-1).

### Why not automate in CI?

Lighthouse CI already catches regressions on every commit. WebPageTest adds value as an investigation tool, not a gate. Running it on every build would burn the 150/mo starter quota fast and add flaky failures (perf scores vary by test location/time).

**Mental model:** Lighthouse CI = automated smoke alarm. WebPageTest = forensic investigation when the alarm goes off.

---

## Web Vitals — Metrics spec, not a tool

[web.dev/vitals](https://web.dev/vitals/) defines Core Web Vitals (LCP, INP, CLS) and other metrics. This is a specification, not something you install.

**Already captured automatically by:**
- **Sentry browser SDK** — field data (real users)
- **Lighthouse CI** — lab data (synthetic), every deploy
- **WebPageTest / Catchpoint** — lab data with multi-location support + filmstrip + waterfall (ad-hoc). Also runs Lighthouse as a checkbox option in the same dashboard, so you can compare its Lighthouse score against the CI score.

No action needed — all three sources are wired up for projects using this package.

---

## Grafana OSS / LGTM stack — Considered, not adopted (2026-04-27)

**Decision:** We use **Dash0** as the OTel backend, not self-hosted Grafana + Loki + Mimir + Tempo.

### Why this was considered

Grafana OSS (the LGTM stack — Loki for logs, Grafana for dashboards, Mimir/Prometheus for metrics, Tempo for traces) is the de facto open-source standard for observability. It is comprehensive, free of license cost, and widely adopted.

### Why we did not adopt it

Grafana would **replace** Dash0, not complement it. Both occupy the same slot in our architecture: an OTel-compatible backend that ingests traces and metrics from `@getdigitalos/observability/dash0/*`. Running both yields no additional signal — only duplicated cost and split dashboards.

The real choice is **managed (Dash0) vs. self-hosted (LGTM)**. We chose managed because:

1. **Single operator today.** Running Loki + Mimir + Tempo + Grafana on our infrastructure is a part-time job. Dash0 absorbs that operational load.
2. **OTel keeps the door open.** All instrumentation goes through OpenTelemetry. Swapping Dash0 for self-hosted Grafana later is a backend config change (endpoint + auth headers), not a code rewrite. This is the entire reason we standardized on OTel.
3. **Cost is currently below the break-even point.** Self-hosting LGTM only wins when the managed bill exceeds the all-in cost of running, securing, backing up, and upgrading four services.

### When to revisit this decision

Move to self-hosted Grafana OSS when **any** of the following becomes true:

- Dash0 pricing exceeds the all-in cost of running LGTM (compute + storage + operator time).
- Dash0's retention window is insufficient for compliance or audit requirements (e.g., HEA, GoldenThread regulated data).
- Dash0 cardinality/quota limits constrain instrumentation we need.
- The team grows enough that operating LGTM is not a side-job for one person.

Until at least one of those triggers fires, the answer to "should we adopt Grafana?" is **no — we already have its OTel-managed equivalent**.

---

## Sentry vs. Dash0 — Role split, not a vendor choice (2026-04-27)

**Decision:** We run **both** Sentry and Dash0. They are not competing products in our stack — they own different roles. Periodic suggestions to "consolidate by removing Sentry and sending everything to Dash0 via OTel" should be evaluated against this section before being acted on.

### Role split

| Concern | Owner | Why |
|---|---|---|
| Application errors (server + browser) | **Sentry** | Stack-trace grouping, fingerprinting, regression detection, source map symbolication, release health |
| Domain / business errors (`captureBusinessError`) | **Sentry** | Same triage UX as application errors — surfaces in the same issue list |
| Breadcrumbs / lifecycle events leading up to errors | **Sentry** | Attached to error reports for debugging context |
| PII scrubbing on error pipeline | **Sentry** (`beforeSend` hook) | See [src/sentry/pii.ts](../src/sentry/pii.ts) |
| Browser session replay | **Sentry** | No equivalent in OTel/Dash0 |
| Distributed traces | **Dash0** | OTel-native, no proprietary schema remap |
| Application & runtime metrics | **Dash0** | OTel-native, vendor-neutral instrumentation |
| Logs (when added) | **Dash0** | OTel-native log records with resource attributes |

### What changed in the package (2026-04-27)

To enforce the split and avoid double-billing for traces, [`initSentry`](../src/sentry/server.ts) now defaults `tracesSampleRate` and `profilesSampleRate` to `0`. Sentry no longer collects spans or profiles unless a caller explicitly opts back in. Dash0 is the trace and metrics backend.

### Why this is not "vendor sprawl"

Both vendors charge for what they ingest. Because Sentry no longer ingests traces or profiles, our Sentry bill is now scoped to errors + (optional) session replay only — the categories where Sentry's UX is materially better than an OTel backend.

### Why we did not replace Sentry with OTel-to-Dash0

A recommendation periodically surfaces to remove the `@sentry/*` dependencies entirely and send exception data to Dash0 as OTel span events or log records. We rejected this because:

1. **OTel error tooling lags Sentry by years.** Span events and `recordException` exist, but the triage workflow ("47 grouped instances of TypeError, regressed in v2.3.1, affecting 12% of sessions") is not reproducible by tailing logs in any OTel backend today, including Dash0.
2. **Dash0's own positioning page** ([dash0.com/sentry-alternative](https://www.dash0.com/sentry-alternative)) does not claim parity on source maps, session replay, release health, breadcrumbs, or fingerprinting. It pitches on OTel-native ingestion, transparent pricing, and resource-based navigation — all of which we already get for traces and metrics.
3. **PII scrubbing, release health, source map upload, and session replay would all need to be rebuilt** if we removed Sentry. That is real engineering cost for no offsetting capability.

### When to revisit this decision

Re-evaluate removing Sentry when **any** of the following becomes true:

- An OTel backend (Dash0 or otherwise) ships first-class error grouping, source map symbolication, and release health that match Sentry's triage UX.
- Sentry's bill becomes a meaningful line item that exceeds the cost of rebuilding the above on Dash0.
- Error volume drops low enough that "search logs by exception type" is a sufficient triage workflow.

Until at least one of those triggers fires, the answer to "should we drop Sentry for OTel-only?" is **no — Sentry and Dash0 own non-overlapping roles, and we have already eliminated the only real overlap (traces) by defaulting Sentry tracing to off**.
