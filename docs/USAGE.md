# @getdigitalos/observability — Usage Guide

Shared observability layer for all GetDigitalOS services. Handles **Sentry** (errors), **Dash0/OTel** (traces + metrics), and **Plausible** (analytics).

## Install

```json
{
  "dependencies": {
    "@getdigitalos/observability": "github:GetDigitalOS/observability#v0.1.1"
  }
}
```

Then `pnpm install`. No private registry / `GITHUB_TOKEN` needed — GitHub resolves the tag over HTTPS.

## Subpath exports

| Import path | Runtime | Purpose |
|---|---|---|
| `@getdigitalos/observability/dash0/server` | Node | Init OTel SDK (traces + metrics to Dash0) |
| `@getdigitalos/observability/dash0/fastify` | Node / Fastify | Plugin that enriches spans with route metadata |
| `@getdigitalos/observability/dash0/express` | Node / Express | Middleware equivalent of the Fastify plugin |
| `@getdigitalos/observability/dash0/metrics` | Node | `incrementCounter`, `recordHistogram`, `recordGauge`, `trackMetric` |
| `@getdigitalos/observability/sentry/server` | Node | Init Sentry SDK on the server |
| `@getdigitalos/observability/sentry/client` | Browser | Init Sentry in React / Vite / Next.js client |
| `@getdigitalos/observability/sentry/edge` | Edge | Init Sentry in Edge runtime |
| `@getdigitalos/observability/sentry/nextjs` | Next.js | `withObservabilitySentryConfig`, `createInstrumentation` |
| `@getdigitalos/observability/plausible` | React | `<PlausibleScript>`, `usePlausible()` |

## Peer dependencies

Only install what your service actually uses. All peers are optional:

- **Dash0 (Node)** → `@opentelemetry/api`, `@opentelemetry/sdk-node`, `@opentelemetry/exporter-trace-otlp-http`, `@opentelemetry/exporter-metrics-otlp-http`, `@opentelemetry/auto-instrumentations-node`, `@opentelemetry/resources`, `@opentelemetry/sdk-metrics`, `@opentelemetry/semantic-conventions`
- **Sentry (Node)** → `@sentry/node`
- **Sentry (React)** → `@sentry/react`
- **Sentry (Next.js)** → `@sentry/nextjs`

The package imports these lazily — if absent, the corresponding feature no-ops silently.

## Env vars (auto-detected)

| Var | Used by | Notes |
|---|---|---|
| `DASH0_AUTH_TOKEN` | Dash0 | If unset → Dash0 is a no-op |
| `OTEL_SERVICE_NAME` | Dash0 | Shown in traces. Set per service. |
| `SENTRY_DSN` | Sentry (server) | If unset → Sentry is a no-op |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry (Next.js client) | |
| `VITE_SENTRY_DSN` | Sentry (Vite client) | |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible | |
| `VITE_PLAUSIBLE_DOMAIN` | Plausible | |
| `NODE_ENV` | all | Drives default sample rates |

**Safe by default**: every init function checks for its env var and returns silently if missing. You can call `initDash0()` and `initSentry()` unconditionally in dev.

---

# SOP: Adding observability to a new Node service (Fastify/Express)

### 1. Install peers

```bash
pnpm add @getdigitalos/observability@github:GetDigitalOS/observability#v0.1.1 \
         @sentry/node \
         @opentelemetry/api \
         @opentelemetry/sdk-node \
         @opentelemetry/auto-instrumentations-node \
         @opentelemetry/exporter-trace-otlp-http \
         @opentelemetry/exporter-metrics-otlp-http \
         @opentelemetry/resources \
         @opentelemetry/sdk-metrics \
         @opentelemetry/semantic-conventions
```

### 2. Init at the TOP of your entry file

OTel works by monkey-patching Node built-ins. If `fastify`, `pg`, `ioredis`, etc. import **before** `initDash0` runs, they won't be instrumented. This is the single most common bug — the order matters.

```ts
// src/server.ts — FIRST TWO LINES

import { initDash0 } from '@getdigitalos/observability/dash0/server';
import { initSentry } from '@getdigitalos/observability/sentry/server';

await initDash0({ endpoint: 'https://ingress.us-west-2.aws.dash0.com' });
await initSentry({
  highPriorityRoutes: ['/webhooks/', '/api/v1/auth/'],
  lowPriorityRoutes: ['/health'],
});

// --- now safe to import everything else ---
import Fastify from 'fastify';
import { db } from './database/connection.js';
// ...
```

### 3. Register the route-enrichment plugin

After Fastify is constructed but **before** route registration:

```ts
const { default: dash0Plugin } = await import('@getdigitalos/observability/dash0/fastify');
await app.register(dash0Plugin);
```

For Express:

```ts
import { dash0Middleware } from '@getdigitalos/observability/dash0/express';
app.use(dash0Middleware());
```

### 4. Set env vars in production

In Railway / Vercel / Cloudflare dashboard:

```
DASH0_AUTH_TOKEN=<from Dash0 dashboard>
SENTRY_DSN=<from Sentry project settings>
OTEL_SERVICE_NAME=<your-service-name>
```

Reference implementation: [conduit/src/server.ts:1-10](https://github.com/GetDigitalOS/conduit/blob/main/src/server.ts#L1-L10)

---

# SOP: Adding observability to Next.js

### 1. Install

```bash
pnpm add @getdigitalos/observability@github:GetDigitalOS/observability#v0.1.1 \
         @sentry/nextjs
```

### 2. Wrap `next.config.ts`

```ts
import { withObservabilitySentryConfig } from '@getdigitalos/observability/sentry/nextjs';

const nextConfig = { reactStrictMode: true };
export default await withObservabilitySentryConfig(nextConfig);
```

Requires `SENTRY_ORG` and `SENTRY_PROJECT` env vars for source map uploads.

### 3. Create `src/instrumentation.ts`

```ts
import { createInstrumentation } from '@getdigitalos/observability/sentry/nextjs';
export const { register, onRequestError } = createInstrumentation({
  highPriorityRoutes: ['/api/checkout', '/api/webhook/'],
});
```

### 4. Init browser Sentry in `app/layout.tsx` (or root client component)

```tsx
'use client';
import { useEffect } from 'react';
import { initSentryClient } from '@getdigitalos/observability/sentry/client';

useEffect(() => { void initSentryClient(); }, []);
```

### 5. Add Plausible

```tsx
import { PlausibleScript } from '@getdigitalos/observability/plausible';

// in layout:
<head><PlausibleScript /></head>
```

```tsx
import { usePlausible } from '@getdigitalos/observability/plausible';

function BuyButton() {
  const track = usePlausible();
  return <button onClick={() => track('Purchase', { plan: 'pro' })}>Buy</button>;
}
```

---

# SOP: Adding observability to a Vite / React SPA

```ts
// src/main.tsx — before ReactDOM.render
import { initSentryClient } from '@getdigitalos/observability/sentry/client';
await initSentryClient();
```

Set `VITE_SENTRY_DSN` in Cloudflare Pages / Vercel env.

---

# Custom metrics

```ts
import {
  incrementCounter,
  recordHistogram,
  trackMetric,
} from '@getdigitalos/observability/dash0/metrics';

// Count something
await incrementCounter('jobs.enqueued', { queue: 'email' });

// Measure something
await recordHistogram('pdf.render.duration_ms', elapsed, { template: 'invoice' });

// Business KPI (auto-prefixed with OTEL_SERVICE_NAME)
await trackMetric('revenue.cents', 4999, { plan: 'pro' });
```

All are no-ops when `DASH0_AUTH_TOKEN` is unset — safe in dev.

---

# Structured error capture

For domain errors that aren't thrown exceptions but should still be tracked:

```ts
import {
  captureBusinessError,
  addLifecycleBreadcrumb,
} from '@getdigitalos/observability/sentry/server';

addLifecycleBreadcrumb('worker.started', { queueName: 'webhooks' });

if (routingFailed) {
  captureBusinessError('webhook_routing_mismatch', {
    webhookId: id,
    expectedConnector: 'ghl',
    receivedSignature: sig.slice(0, 8),
  });
}
```

---

# Sample rate strategy

`initSentry` uses tiered sampling in production based on route patterns you pass:

| Route category | Prod rate | Use for |
|---|---|---|
| `highPriorityRoutes` | 50% | Payment, auth, webhooks, anything revenue-critical |
| Default | 20% | Business logic routes |
| `lowPriorityRoutes` | 1% | `/health`, SSE, polling endpoints |
| Dev | 100% | always |

Don't sample metrics — only traces. Metrics aggregate at export time and cost nothing extra.

---

# Troubleshooting

| Symptom | Likely cause |
|---|---|
| No traces in Dash0 | `DASH0_AUTH_TOKEN` not set, or `initDash0` ran after another module imported `http`/`fastify` |
| Traces work, errors don't | `SENTRY_DSN` not set, or `initSentry` was not awaited |
| Fastify spans missing route names | `dash0Plugin` not registered, or registered after routes |
| `GITHUB_TOKEN` error on install | You're on an old `.npmrc` — the package no longer needs it. Remove the `@getdigitalos` registry line. |
| Sentry reports `unknown` environment | Set `NODE_ENV=production` or pass `environment` to `initSentry` |

---

# Upgrade policy

Pin to a tagged release (`#v0.1.1`), not `main`. Bump the tag explicitly when you want new features — this keeps prod builds reproducible.

To publish a new version:

```bash
# in observability repo
npm version patch   # or minor / major
git push --follow-tags
```

Consumers bump their `package.json` reference (`#v0.1.1` → `#v0.1.2`) and re-run `pnpm install`.
