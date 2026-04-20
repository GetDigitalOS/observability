/** Detect if running in production. */
export function isProduction() {
    return getEnv('NODE_ENV') === 'production';
}
/** Detect if running in CI. */
export function isCI() {
    return getEnv('CI') === 'true';
}
/**
 * Read an environment variable from process.env or import.meta.env (Vite).
 * Returns undefined if not set or empty string.
 */
export function getEnv(key) {
    // Node.js / Next.js server
    if (typeof process !== 'undefined' && process.env?.[key]) {
        return process.env[key];
    }
    // Vite client (import.meta.env is statically replaced at build time,
    // so this function works for keys the consuming project has defined)
    if (typeof globalThis !== 'undefined') {
        const meta = globalThis.__VITE_ENV__;
        if (meta?.[key])
            return meta[key];
    }
    return undefined;
}
/** Get Sentry DSN from whichever env var is set. */
export function getSentryDsn() {
    return (getEnv('SENTRY_DSN') ??
        getEnv('NEXT_PUBLIC_SENTRY_DSN') ??
        getEnv('VITE_SENTRY_DSN'));
}
/** Get Dash0 auth token. */
export function getDash0Token() {
    return getEnv('DASH0_AUTH_TOKEN');
}
/** Get Plausible domain from whichever env var is set. */
export function getPlausibleDomain() {
    return (getEnv('NEXT_PUBLIC_PLAUSIBLE_DOMAIN') ?? getEnv('VITE_PLAUSIBLE_DOMAIN'));
}
//# sourceMappingURL=env.js.map