import { getSentryDsn, isProduction } from '../env.js';
/**
 * Initialize Sentry for browser environments (React, Vite, Next.js client).
 * Only initializes if a DSN is available. Safe to call unconditionally.
 *
 * Attempts to load @sentry/nextjs first (for Next.js projects),
 * falls back to @sentry/react (for Vite/CRA projects).
 */
export async function initSentryClient(config) {
    const dsn = config?.dsn ?? getSentryDsn();
    if (!dsn)
        return;
    const prod = isProduction();
    // Dynamic import with string variable to avoid tsc resolving at build time.
    // @sentry/nextjs is only available in Next.js projects; @sentry/react is the fallback.
    let Sentry;
    try {
        const nextjsModule = '@sentry/nextjs';
        Sentry = await import(/* webpackIgnore: true */ nextjsModule);
    }
    catch {
        Sentry = await import('@sentry/react');
    }
    Sentry.init({
        dsn,
        environment: config?.environment ?? (prod ? 'production' : 'development'),
        tracesSampleRate: config?.tracesSampleRate ?? (prod ? 0.1 : 1.0),
        replaysSessionSampleRate: config?.replaysSampleRate ?? 0,
        replaysOnErrorSampleRate: config?.replaysOnErrorSampleRate ?? 1.0,
        debug: false,
    });
}
//# sourceMappingURL=client.js.map