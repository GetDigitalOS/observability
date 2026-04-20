import { isProduction } from '../env.js';
/**
 * Determine the transaction sample rate based on route pattern matching.
 * High-priority routes (webhooks, critical business paths) get 50% sampling.
 * Low-priority routes (health checks, SSE) get 1% sampling.
 * Everything else uses the configured default (0.2 production, 1.0 dev).
 */
export function getTransactionSampleRate(transactionName, config) {
    if (!isProduction())
        return 1.0;
    const highPriority = config?.highPriorityRoutes ?? [];
    if (highPriority.some((r) => transactionName.includes(r))) {
        return 0.5;
    }
    const lowPriority = config?.lowPriorityRoutes ?? [];
    if (lowPriority.some((r) => transactionName.includes(r))) {
        return 0.01;
    }
    return config?.tracesSampleRate ?? 0.2;
}
//# sourceMappingURL=sampling.js.map