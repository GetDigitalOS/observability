import type { SentryConfig } from '../types.js';
/**
 * Initialize Sentry for a Node.js server (Fastify, Express, or Next.js server runtime).
 * Only loads the SDK if a DSN is available. Safe to call unconditionally.
 */
export declare function initSentry(config?: SentryConfig): Promise<void>;
/**
 * Capture a business-logic error with structured context.
 * Use for domain errors (routing failures, validation mismatches) that are
 * not unhandled exceptions but should still be tracked.
 */
export declare function captureBusinessError(message: string, context: Record<string, unknown>): void;
/**
 * Add a breadcrumb for tracking application lifecycle events.
 * Breadcrumbs are attached to subsequent error reports for debugging context.
 */
export declare function addLifecycleBreadcrumb(event: string, data?: Record<string, unknown>): void;
export { getTransactionSampleRate } from './sampling.js';
//# sourceMappingURL=server.d.ts.map