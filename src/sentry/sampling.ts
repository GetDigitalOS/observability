import type { SentryConfig } from '../types.js';
import { isProduction } from '../env.js';

/**
 * Determine the transaction sample rate based on route pattern matching.
 *
 * NOTE: Sentry tracing is OFF by default — Dash0 owns traces. This helper only
 * applies if a caller explicitly opts back into Sentry tracing by passing a
 * non-zero `tracesSampleRate`. Without that, the default below returns 0.
 */
export function getTransactionSampleRate(
  transactionName: string,
  config?: SentryConfig,
): number {
  const baseRate = config?.tracesSampleRate ?? 0;
  if (baseRate === 0) return 0;

  if (!isProduction()) return 1.0;

  const highPriority = config?.highPriorityRoutes ?? [];
  if (highPriority.some((r) => transactionName.includes(r))) {
    return 0.5;
  }

  const lowPriority = config?.lowPriorityRoutes ?? [];
  if (lowPriority.some((r) => transactionName.includes(r))) {
    return 0.01;
  }

  return baseRate;
}
