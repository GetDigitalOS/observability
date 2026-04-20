import { getSentryDsn, isProduction } from '../env.js';
/**
 * Initialize Sentry for edge runtimes (Cloudflare Workers, Next.js Edge).
 * Only initializes if a DSN is available. Safe to call unconditionally.
 */
export async function initSentryEdge(config) {
    const dsn = config?.dsn ?? getSentryDsn();
    if (!dsn)
        return;
    const prod = isProduction();
    // Dynamic import with string variable to avoid tsc resolving @sentry/nextjs at build time
    const nextjsModule = '@sentry/nextjs';
    const Sentry = await import(/* webpackIgnore: true */ nextjsModule);
    Sentry.init({
        dsn,
        environment: config?.environment ?? (prod ? 'production' : 'development'),
        tracesSampleRate: config?.tracesSampleRate ?? (prod ? 0.1 : 1.0),
        debug: false,
    });
}
//# sourceMappingURL=edge.js.map