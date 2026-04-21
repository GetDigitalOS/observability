# External Observability Tools

Tools that complement the `@getdigitalos/observability` package but don't ship as code. These are configured via their own dashboards or run ad-hoc.

---

## UptimeRobot — External uptime monitoring

UptimeRobot pings your URLs from external locations and alerts on downtime. No code integration — configure via their dashboard.

### Adding a monitor

1. Log in at [uptimerobot.com](https://uptimerobot.com)
2. **+ Add New Monitor**
3. Configure:
   - **Type:** HTTP(s)
   - **Friendly Name:** `{project-name} - Production`
   - **URL:** Health endpoint (see table below)
   - **Monitoring Interval:** 5 minutes (free tier)
4. Set **Alert Contacts** (email, Slack webhook, etc.)
5. Save

### Health endpoints by project

| Project | URL | Health endpoint |
|---------|-----|-----------------|
| Conduit | `conduit-production-f80c.up.railway.app` | `/api/health` |
| ActFast | `app-actfast.steep-band-be51.workers.dev` | `/` |
| GoldenThread | `app-goldenthread.steep-band-be51.workers.dev` | `/` |
| HEA Platform (API) | Railway URL | `/api/v1/health` |
| HEA Platform (Web) | `partner.homewealthiq.com` | `/` |
| MyLTCInsurance | Cloudflare Pages URL | `/` |
| Habanero Shaker | TBD | `/` |

### Recommended monitor types

- **HTTP(s)** — Primary: checks URL returns 200 OK
- **Keyword** — Secondary: checks a specific string in response (e.g., `"status":"ok"`)
- **Heartbeat** — For cron jobs: your app pings UptimeRobot instead of the other way around

### Status page (optional)

UptimeRobot generates a public status page: **My Settings > Status Pages**. Free tier: 1 page. Pro ($7/mo): custom domains + branding.

### API automation (future)

UptimeRobot's REST API can be automated from the project registry:
- `POST /v2/newMonitor` — create
- `POST /v2/getMonitors` — list
- `POST /v2/editMonitor` — update

Key is in **My Settings > API Settings**. A future `hub` command could read `registry/projects.json` and auto-provision monitors.

---

## WebPageTest — Ad-hoc performance forensics

Use WebPageTest when Lighthouse flags an issue and you need deeper detail, or when you want to test performance from a specific geographic region. This is a complement to Lighthouse CI, not a replacement.

### When to use

- **After Lighthouse CI flags regression** — WebPageTest gives you filmstrips, waterfalls, and per-request timing that Lighthouse summarizes into a single score.
- **Testing from non-US locations** — LCP can be 3× worse from Sydney or Mumbai vs. US-East. Lighthouse only tests from the CI runner's location.
- **Competitor benchmarking** — run your URL vs. competitor URL side-by-side, filmstrip comparison.
- **Investor/sales demos** — the filmstrip visualization is compelling for non-technical audiences.

### Free tier

- ~200 tests/month per API key
- Unlimited public runs (no API, interactive web UI)
- Sign up at [webpagetest.org](https://www.webpagetest.org/)

### Usage

**Interactive (no setup):** just paste a URL at [webpagetest.org](https://www.webpagetest.org/) and run.

**API (for scheduled tests):**
```bash
curl "https://www.webpagetest.org/runtest.php?url=https://your-site.com&k=YOUR_API_KEY&f=json"
```

### Why not automate in CI?

Lighthouse CI already catches regressions on every commit. WebPageTest adds value as an investigation tool, not a gate. Running it on every build would burn the free-tier quota and add flaky failures (perf scores vary by test location/time).

**Mental model:** Lighthouse CI = automated smoke alarm. WebPageTest = forensic investigation when the alarm goes off.

---

## Web Vitals — Metrics spec, not a tool

[web.dev/vitals](https://web.dev/vitals/) defines Core Web Vitals (LCP, INP, CLS) and other metrics. This is a specification, not something you install.

**Already captured automatically by:**
- **Sentry browser SDK** — field data (real users)
- **Lighthouse CI** — lab data (synthetic)
- **WebPageTest** — lab data with multi-location support (when used)

No action needed — all three sources are already wired up for projects using this package.
