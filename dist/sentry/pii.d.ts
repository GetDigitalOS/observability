/**
 * PII scrubbing for Sentry events.
 * Strips authorization and cookie headers before sending to Sentry.
 * Uses generic types to satisfy Sentry's beforeSend signature.
 */
export declare function scrubPii<T extends Record<string, any>>(event: T): T;
//# sourceMappingURL=pii.d.ts.map