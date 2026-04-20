import { createRequire } from 'node:module';
import { isCI } from '../env.js';
/**
 * Wrap a Next.js config with Sentry's build-time plugin.
 * Handles source map uploads, release tracking, and build instrumentation.
 *
 * Usage in next.config.ts:
 * ```ts
 * import { withObservabilitySentryConfig } from '@getdigitalos/observability/sentry/nextjs';
 * export default withObservabilitySentryConfig(nextConfig);
 * ```
 *
 * Synchronous — no top-level await needed in next.config.ts.
 */
export function withObservabilitySentryConfig(nextConfig, opts) {
    try {
        // Use createRequire so we can synchronously require the CJS build of @sentry/nextjs
        // from within an ESM package, without forcing the caller to use top-level await.
        const require = createRequire(import.meta.url);
        const sentryNextjs = require('@sentry/nextjs');
        return sentryNextjs.withSentryConfig(nextConfig, {
            org: opts?.org ?? process.env.SENTRY_ORG,
            project: opts?.project ?? process.env.SENTRY_PROJECT,
            silent: opts?.silent ?? !isCI(),
            widenClientFileUpload: opts?.widenClientFileUpload ?? true,
            disableLogger: opts?.disableLogger ?? true,
            automaticVercelMonitors: opts?.automaticVercelMonitors ?? false,
        });
    }
    catch {
        // @sentry/nextjs not installed — return config as-is
        return nextConfig;
    }
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