import type { SentryConfig, SentryBuildOptions } from '../types.js';
/**
 * Wrap a Next.js config with Sentry's build-time plugin.
 * Handles source map uploads, release tracking, and build instrumentation.
 *
 * Usage in next.config.ts:
 * ```ts
 * import { withObservabilitySentryConfig } from '@getdigital/observability/sentry/nextjs';
 * export default withObservabilitySentryConfig({ reactStrictMode: true });
 * ```
 */
export declare function withObservabilitySentryConfig(nextConfig: Record<string, unknown>, opts?: SentryBuildOptions): Promise<Record<string, unknown>>;
/**
 * Create Next.js instrumentation hooks for Sentry.
 * Returns `register` and `onRequestError` functions for use in instrumentation.ts.
 *
 * Usage in src/instrumentation.ts:
 * ```ts
 * import { createInstrumentation } from '@getdigital/observability/sentry/nextjs';
 * export const { register, onRequestError } = createInstrumentation();
 * ```
 */
export declare function createInstrumentation(config?: SentryConfig): {
    register(): Promise<void>;
    onRequestError(...args: unknown[]): Promise<void>;
};
//# sourceMappingURL=nextjs.d.ts.map