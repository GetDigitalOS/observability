import type { SentryConfig } from '../types.js';
/**
 * Initialize Sentry for browser environments (React, Vite, Next.js client).
 * Only initializes if a DSN is available. Safe to call unconditionally.
 *
 * Attempts to load @sentry/nextjs first (for Next.js projects),
 * falls back to @sentry/react (for Vite/CRA projects).
 */
export declare function initSentryClient(config?: SentryConfig): Promise<void>;
//# sourceMappingURL=client.d.ts.map