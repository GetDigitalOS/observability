import type { SentryConfig, SentryBuildOptions } from '../types.js';
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
export declare function defaultSentryBuildOptions(opts?: SentryBuildOptions): Record<string, unknown>;
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
export declare function createInstrumentation(config?: SentryConfig): {
    register(): Promise<void>;
    onRequestError(...args: unknown[]): Promise<void>;
};
//# sourceMappingURL=nextjs.d.ts.map