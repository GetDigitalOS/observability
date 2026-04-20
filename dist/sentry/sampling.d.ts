import type { SentryConfig } from '../types.js';
/**
 * Determine the transaction sample rate based on route pattern matching.
 * High-priority routes (webhooks, critical business paths) get 50% sampling.
 * Low-priority routes (health checks, SSE) get 1% sampling.
 * Everything else uses the configured default (0.2 production, 1.0 dev).
 */
export declare function getTransactionSampleRate(transactionName: string, config?: SentryConfig): number;
//# sourceMappingURL=sampling.d.ts.map