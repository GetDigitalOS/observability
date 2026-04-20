import { isCI } from '../env.js';
/**
 * Returns sensible default build options for Sentry's Next.js plugin.
 * Use this with `withSentryConfig` from `@sentry/nextjs` directly —
 * we don't wrap it because Webpack can't bundle dynamic requires in next.config.ts.
 *
 * Usage in next.config.ts:
 * ```ts
 * import { withSentryConfig } from '@sentry/nextjs';
 * import { defaultSentryBuildOptions } from '@getdigitalos/observability/sentry/nextjs';
 * export default withSentryConfig(nextConfig, defaultSentryBuildOptions());
 * ```
 */
export function defaultSentryBuildOptions(opts) {
    return {
        org: opts?.org ?? process.env.SENTRY_ORG,
        project: opts?.project ?? process.env.SENTRY_PROJECT,
        silent: opts?.silent ?? !isCI(),
        widenClientFileUpload: opts?.widenClientFileUpload ?? true,
        disableLogger: opts?.disableLogger ?? true,
        automaticVercelMonitors: opts?.automaticVercelMonitors ?? false,
    };
}
/**
 * Create Next.js instrumentation hooks for Sentry.
 * Returns `register` and `onRequestError` functions for use in instrumentation.ts.
 *
 * Usage in src/instrumentation.ts:
 * ```ts
 * import { createInstrumentation } from '@getdigitalos/observability/sentry/nextjs';
 * export const { register, onRequestError } = createInstrumentation();
 * ```
 */
export function createInstrumentation(config) {
    return {
        async register() {
            if (process.env.NEXT_RUNTIME === 'nodejs') {
                const { initSentry } = await import('./server.js');
                await initSentry(config);
            }
            if (process.env.NEXT_RUNTIME === 'edge') {
                const { initSentryEdge } = await import('./edge.js');
                await initSentryEdge(config);
            }
        },
        async onRequestError(...args) {
            try {
                const nextjsModule = '@sentry/nextjs';
                const mod = await import(/* webpackIgnore: true */ nextjsModule);
                mod.captureRequestError?.(...args);
            }
            catch {
                // @sentry/nextjs not installed or DSN not configured
            }
        },
    };
}
//# sourceMappingURL=nextjs.js.map