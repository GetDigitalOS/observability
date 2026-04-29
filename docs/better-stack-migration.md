# Better Stack Migration Playbook (one-time)

> **Purpose:** One-time checklist for migrating uptime monitoring from UptimeRobot → Better Stack. Delete this file after the 2-week burn-in period confirms the migration is stable and UptimeRobot is decommissioned.

**Started:** 2026-04-28

## Step 1 — Account setup

- [ ] Sign up at [betterstack.com](https://betterstack.com) using `brian@getdigitalagency.com`.
- [ ] Skip the team invite step for now (single operator).
- [ ] Confirm the dashboard shows: 10 monitors / 10 heartbeats / 1 status page free-tier allowance.

## Step 2 — Alert channels

Configure these BEFORE creating monitors, so the first monitor gets routed correctly.

- [ ] **Email channel:** `brian@getdigitalagency.com` — primary.
- [ ] **Slack channel:** integrate with the GetDigital workspace, route to `#alerts` (create if missing).
- [ ] **Mobile push:** install the Better Stack iOS/Android app, accept push permissions.

Default escalation policy: **Email + Slack immediately, push after 2 minutes if unacknowledged.** No on-call rotation (would require a paid Responder seat).

## Step 3 — Create monitors

Add each via **Monitors → Create monitor**. Settings shared across all monitors:

- **Check frequency:** 3 minutes (free-tier max)
- **Request timeout:** 30 seconds
- **Verify SSL:** On
- **Alert when:** site is down for **2 consecutive checks**
- **Recovery alert:** On
- **Regions:** all available (free tier rotates across multiple)

### Monitor list (7 monitors — fits free-tier ceiling of 10)

| # | Name | URL | Type | Keyword | Notes |
|---|---|---|---|---|---|
| 1 | Conduit — Production | `https://conduit-production-f80c.up.railway.app/api/health` | Keyword | `"status":"ok"` | Tier 4 platform, business-critical |
| 2 | ActFast — Production | `https://app-actfast.steep-band-be51.workers.dev/` | HTTP | — | Tier 4 platform |
| 3 | GoldenThread — Production | `https://app-goldenthread.steep-band-be51.workers.dev/` | HTTP | — | Tier 4 platform, regulated workload |
| 4 | HEA Platform — Web | `https://hea-web-production.up.railway.app/` | HTTP | — | Verify if `partner.homewealthiq.com` should be used instead (custom domain) |
| 5 | MyLTCInsurance — Production | `https://website-myltcinsurance.pages.dev/` | HTTP | — | Tier 3, custom domain pending |
| 6 | Habanero Shaker — Production | `https://website-habaneroshaker.pages.dev/` | HTTP | — | Tier 3 |
| 7 | (reserved) HEA Platform — API health | `https://hea-web-production.up.railway.app/api/v1/health` | Keyword | `"status":"ok"` | **Verify the endpoint exists before adding** — if no health endpoint, skip this monitor |

**3 monitor slots remain** on the free tier for future projects or for promoting one of the above to a Keyword check.

## Step 4 — Heartbeats (BullMQ workers)

Conduit runs two in-process BullMQ workers ([conduit/src/server.ts:193,204](../../conduit/src/server.ts#L193)). Each should ping a Better Stack heartbeat URL on every successful job, with an alert if no ping arrives within the expected window.

- [ ] Create heartbeat: `Conduit — webhook delivery worker` (expected interval: 1 hour or whatever the longest backoff window is)
- [ ] Create heartbeat: `Conduit — prospect intelligence worker` (expected interval: 1 day, since this runs on schedule)
- [ ] Wire the heartbeat URLs into the workers (via env vars `BETTERSTACK_HEARTBEAT_WEBHOOK_URL` / `BETTERSTACK_HEARTBEAT_PROSPECT_URL`) and ping on `worker.on('completed')`.
- [ ] Confirm intervals against actual job cadence — heartbeats that fire too aggressively will alert on every quiet period.

> **Defer if uncertain.** Heartbeats are nice-to-have. If you're not sure about the cadence, skip this step until you've watched real worker traffic for a week.

## Step 5 — Status page

- [ ] **Status pages → Create status page**
- [ ] Name: `GetDigitalOS — Status`
- [ ] Subdomain: `status.getdigital.{better-stack-suffix}` (custom domain `status.getdigital.com` later if desired — free tier supports it)
- [ ] Add all 6–7 monitors as **components**, grouped by company:
  - **GetDigital**: Conduit, ActFast, GoldenThread
  - **Barastone**: HEA Platform (Web), HEA Platform (API)
  - **Freebridge**: MyLTCInsurance
  - **GetDigital — Marketing sites**: Habanero Shaker
- [ ] Set status page to **public** (no login required).
- [ ] Subscribe `brian@getdigitalagency.com` to incident updates.

## Step 6 — Burn-in period (2 weeks)

- [ ] Run UptimeRobot AND Better Stack in parallel through **2026-05-12**.
- [ ] At end of period, confirm:
  - No false-positive alerts from Better Stack
  - All real downtime events were caught by Better Stack
  - Slack/email/push routing all worked
- [ ] If clean: pause/cancel UptimeRobot account, delete the historical UptimeRobot section from [external-tools.md](external-tools.md), and delete this playbook.
- [ ] If any issue: document the gap here, decide whether to fix on Better Stack or roll back to UptimeRobot.

## Step 7 — Update registry

After successful burn-in:

- [ ] Add a `monitors` field to each project entry in [project-hub/registry/projects.json](../../../project-hub/registry/projects.json) pointing at the Better Stack monitor ID, so future tooling can introspect monitoring coverage.
- [ ] Optional: write a `hub` command that reads `registry/projects.json` and reconciles monitors via the Better Stack API.

## Cost tracker

Update this row whenever the spend changes.

| Date | Plan | Monthly cost | Reason |
|---|---|---|---|
| 2026-04-28 | Free | $0 | Initial migration, 7 monitors, 1 status page |
