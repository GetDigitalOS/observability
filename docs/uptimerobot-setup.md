# UptimeRobot Setup Guide

UptimeRobot monitors your projects' uptime from external locations. No code integration needed — configure via dashboard or API.

## Adding a New Monitor

1. Log in at [uptimerobot.com](https://uptimerobot.com)
2. Click **+ Add New Monitor**
3. Configure:
   - **Type:** HTTP(s)
   - **Friendly Name:** `{project-name} - Production`
   - **URL:** Your project's health endpoint (see table below)
   - **Monitoring Interval:** 5 minutes (free tier)
4. Set **Alert Contacts** (email, Slack webhook, etc.)
5. Save

## Health Endpoints by Project

| Project | URL | Health Endpoint |
|---------|-----|----------------|
| Conduit | `conduit-production-f80c.up.railway.app` | `/api/health` |
| ActFast | TBD (Cloudflare Workers) | `/api/health` or `/` |
| GoldenThread | `app-goldenthread.steep-band-be51.workers.dev` | `/` |
| HEA Platform (API) | Railway URL | `/api/v1/health` |
| HEA Platform (Web) | `partner.homewealthiq.com` | `/` |
| MyLTCInsurance | Cloudflare Pages URL | `/` |
| Habanero Shaker | TBD | `/` |

## Recommended Monitor Types

- **HTTP(s)** — Primary: checks that the URL returns 200 OK
- **Keyword** — Secondary: checks that a specific string appears in the response (e.g., `"status":"ok"`)
- **Heartbeat** — For cron jobs: your app pings UptimeRobot instead of UptimeRobot pinging you

## Status Page (Optional)

UptimeRobot can generate a public status page:
1. Go to **My Settings > Status Pages**
2. Create a page, add your monitors
3. Get a public URL like `status.yourdomain.com`

Free tier: 1 status page. Pro ($7/mo): custom domains, branding.

## API Automation (Future)

UptimeRobot has a REST API for managing monitors programmatically:
- `POST /v2/newMonitor` — Create a monitor
- `POST /v2/getMonitors` — List all monitors
- `POST /v2/editMonitor` — Update a monitor

API key available in **My Settings > API Settings**.

A future enhancement could read project URLs from `projects.json` and auto-create monitors.
