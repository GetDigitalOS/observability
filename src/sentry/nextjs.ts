import { createRequire } from 'node:module';
import type { SentryConfig, SentryBuildOptions } from '../types.js';
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
export function withObservabilitySentryConfig<T extends object>(
  nextConfig: T,
  opts?: SentryBuildOptions,
): T {
  try {
    // Use createRequire so we can synchronously require the CJS build of @sentry/nextjs
    // from within an ESM package, without forcing the caller to use top-level await.
    const require = createRequire(import.meta.url);
    const sentryNextjs = require('@sentry/nextjs') as {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      withSentryConfig: (config: any, opts: Record<string, unknown>) => T;
    };
    return sentryNextjs.withSentryConfig(nextConfig, {
      org: opts?.org ?? process.env.SENTRY_ORG,
      project: opts?.project ?? process.env.SENTRY_PROJECT,
      silent: opts?.silent ?? !isCI(),
      widenClientFileUpload: opts?.widenClientFileUpload ?? true,
      disableLogger: opts?.disableLogger ?? true,
      automaticVercelMonitors: opts?.automaticVercelMonitors ?? false,
    });
  } catch {
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
export function createInstrumentation(config?: SentryConfig) {
  return {
    async register(): Promise<void> {
      if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { initSentry } = await import('./server.js');
        await initSentry(config);
      }

      if (process.env.NEXT_RUNTIME === 'edge') {
        const { initSentryEdge } = await import('./edge.js');
        await initSentryEdge(config);
      }
    },

    async onRequestError(
      ...args: unknown[]
    ): Promise<void> {
      try {
        const nextjsModule = '@sentry/nextjs';
        const mod = await import(/* webpackIgnore: true */ nextjsModule) as {
          captureRequestError?: (...args: unknown[]) => unknown;
        };
        mod.captureRequestError?.(...args);
      } catch {
        // @sentry/nextjs not installed or DSN not configured
      }
    },
  };
}
