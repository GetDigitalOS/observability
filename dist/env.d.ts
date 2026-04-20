/** Detect if running in production. */
export declare function isProduction(): boolean;
/** Detect if running in CI. */
export declare function isCI(): boolean;
/**
 * Read an environment variable from process.env or import.meta.env (Vite).
 * Returns undefined if not set or empty string.
 */
export declare function getEnv(key: string): string | undefined;
/** Get Sentry DSN from whichever env var is set. */
export declare function getSentryDsn(): string | undefined;
/** Get Dash0 auth token. */
export declare function getDash0Token(): string | undefined;
/** Get Plausible domain from whichever env var is set. */
export declare function getPlausibleDomain(): string | undefined;
//# sourceMappingURL=env.d.ts.map