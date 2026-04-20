# @getdigitalos/observability

Shared observability layer for all GetDigitalOS services — **Sentry** (errors), **Dash0/OTel** (traces + metrics), **Plausible** (analytics).

One package, one API, one upgrade path.

## Quick install

```json
{
  "dependencies": {
    "@getdigitalos/observability": "github:GetDigitalOS/observability#v0.1.1"
  }
}
```

## Quick start — Node (Fastify/Express)

These MUST be the first two imports in your entry file. OTel works by monkey-patching Node built-ins; if anything else loads first, instrumentation is lost.

```ts
import { initDash0 } from '@getdigitalos/observability/dash0/server';
import { initSentry } from '@getdigitalos/observability/sentry/server';

await initDash0({ endpoint: 'https://ingress.us-west-2.aws.dash0.com' });
await initSentry({
  highPriorityRoutes: ['/webhooks/', '/api/v1/auth/'],
  lowPriorityRoutes: ['/health'],
});
```

## Full documentation

See [docs/USAGE.md](docs/USAGE.md) for:

- Subpath exports and peer-dependency matrix
- Env-var reference
- SOPs for Fastify/Express, Next.js, Vite/React
- Custom metrics (`incrementCounter`, `recordHistogram`, `trackMetric`)
- Structured error capture (`captureBusinessError`, breadcrumbs)
- Sample-rate strategy
- Troubleshooting
- Upgrade / publish policy

## Reference implementations

| Service | Framework | Entry point |
|---|---|---|
| [Conduit](https://github.com/GetDigitalOS/conduit) | Fastify | [src/server.ts](https://github.com/GetDigitalOS/conduit/blob/main/src/server.ts) |

## Related

- [docs/uptimerobot-setup.md](docs/uptimerobot-setup.md) — UptimeRobot monitor configuration
- [src/lighthouse/lighthouserc.base.js](src/lighthouse/lighthouserc.base.js) — Lighthouse CI base config (import via `@getdigitalos/observability/lighthouse/config`)

## License

UNLICENSED — internal GetDigitalOS use only.
