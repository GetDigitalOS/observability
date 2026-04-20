/**
 * PII scrubbing for Sentry events.
 * Strips authorization and cookie headers before sending to Sentry.
 * Uses generic types to satisfy Sentry's beforeSend signature.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scrubPii(event) {
    if (event.request?.headers) {
        delete event.request.headers['authorization'];
        delete event.request.headers['cookie'];
    }
    return event;
}
//# sourceMappingURL=pii.js.map