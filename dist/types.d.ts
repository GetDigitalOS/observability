export interface SentryConfig {
    /** Sentry DSN. Defaults to SENTRY_DSN or NEXT_PUBLIC_SENTRY_DSN or VITE_SENTRY_DSN env var. */
    dsn?: string;
    /** Environment name. Defaults to NODE_ENV. */
    environment?: string;
    /** Fraction of transactions to trace (0-1). Defaults to 0.1 in production, 1.0 in development. */
    tracesSampleRate?: number;
    /** Fraction of sessions to replay (0-1). Defaults to 0. */
    replaysSampleRate?: number;
    /** Fraction of error sessions to replay (0-1). Defaults to 1.0. */
    replaysOnErrorSampleRate?: number;
    /** Fraction of transactions to profile (0-1). Defaults to 0.1 in production, 0 in development. */
    profilesSampleRate?: number;
    /** Scrub PII (authorization, cookie headers) from events. Defaults to true. */
    scrubPii?: boolean;
    /** Route patterns sampled at higher rate (0.5) in production. */
    highPriorityRoutes?: string[];
    /** Route patterns sampled at lower rate (0.01) in production. */
    lowPriorityRoutes?: string[];
}
export interface SentryBuildOptions {
    /** Sentry org slug. Defaults to SENTRY_ORG env var. */
    org?: string;
    /** Sentry project slug. Defaults to SENTRY_PROJECT env var. */
    project?: string;
    /** Suppress build output unless in CI. Defaults to true outside CI. */
    silent?: boolean;
    /** Upload all client source files for better stack traces. Defaults to true. */
    widenClientFileUpload?: boolean;
    /** Disable Sentry's internal logger. Defaults to true. */
    disableLogger?: boolean;
    /** Disable Vercel's automatic cron/function monitors. Defaults to true. */
    automaticVercelMonitors?: boolean;
}
export interface Dash0Config {
    /** Dash0 auth token. Defaults to DASH0_AUTH_TOKEN env var. */
    authToken?: string;
    /** OTLP endpoint URL. Defaults to Dash0's ingress endpoint. */
    endpoint?: string;
    /** Service name for traces/metrics. Defaults to npm package name or OTEL_SERVICE_NAME. */
    serviceName?: string;
    /** Environment name. Defaults to NODE_ENV. */
    environment?: string;
    /** Fraction of traces to sample (0-1). Defaults to 1.0 in dev, 0.2 in production. */
    tracesSampleRate?: number;
    /** Enable runtime metrics collection. Defaults to true. */
    runtimeMetrics?: boolean;
}
export interface PlausibleConfig {
    /** Site domain to track. Defaults to NEXT_PUBLIC_PLAUSIBLE_DOMAIN or VITE_PLAUSIBLE_DOMAIN. */
    domain?: string;
    /** Custom script URL for self-hosted Plausible. Defaults to https://plausible.io/js/script.js */
    scriptUrl?: string;
}
//# sourceMappingURL=types.d.ts.map