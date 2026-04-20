import type { SentryConfig } from '../types.js';
/**
 * Initialize Sentry for edge runtimes (Cloudflare Workers, Next.js Edge).
 * Only initializes if a DSN is available. Safe to call unconditionally.
 */
export declare function initSentryEdge(config?: SentryConfig): Promise<void>;
//# sourceMappingURL=edge.d.ts.map