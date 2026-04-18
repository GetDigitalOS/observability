import type { SentryConfig } from '../types.js';
import { getSentryDsn, isProduction } from '../env.js';
import { scrubPii } from './pii.js';

type SentryModule = typeof import('@sentry/node');
let Sentry: SentryModule | null = null;

/**
 * Initialize Sentry for a Node.js server (Fastify, Express, or Next.js server runtime).
 * Only loads the SDK if a DSN is available. Safe to call unconditionally.
 */
export async function initSentry(config?: SentryConfig): Promise<void> {
  const dsn = config?.dsn ?? getSentryDsn();
  if (!dsn) return;

  const mod = await import('@sentry/node');
  Sentry = mod;

  const prod = isProduction();

  mod.init({
    dsn,
    environment: config?.environment ?? (prod ? 'production' : 'development'),
    tracesSampleRate: config?.tracesSampleRate ?? (prod ? 0.2 : 1.0),
    profilesSampleRate: config?.profilesSampleRate ?? (prod ? 0.1 : 0),
    beforeSend: config?.scrubPii !== false ? scrubPii : undefined,
  });
}

/**
 * Capture a business-logic error with structured context.
 * Use for domain errors (routing failures, validation mismatches) that are
 * not unhandled exceptions but should still be tracked.
 */
export function captureBusinessError(
  message: string,
  context: Record<string, unknown>,
): void {
  if (!Sentry) return;

  Sentry.withScope((scope) => {
    scope.setLevel('error');
    scope.setTag('error.type', 'business_logic');

    for (const [key, value] of Object.entries(context)) {
      scope.setExtra(key, value);
    }

    Sentry!.captureMessage(message, 'error');
  });
}

/**
 * Add a breadcrumb for tracking application lifecycle events.
 * Breadcrumbs are attached to subsequent error reports for debugging context.
 */
export function addLifecycleBreadcrumb(
  event: string,
  data?: Record<string, unknown>,
): void {
  if (!Sentry) return;

  Sentry.addBreadcrumb({
    category: 'application.lifecycle',
    message: event,
    data,
    level: 'info',
  });
}

export { getTransactionSampleRate } from './sampling.js';
