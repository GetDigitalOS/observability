declare global {
  interface Window {
    plausible?: (
      event: string,
      options?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

/**
 * React hook for tracking custom events with Plausible.
 * Returns a no-op if Plausible is not loaded (script not included or domain not set).
 *
 * Usage:
 * ```tsx
 * import { usePlausible } from '@getdigital/observability/plausible';
 *
 * function SignupButton() {
 *   const { trackEvent } = usePlausible();
 *   return <button onClick={() => trackEvent('signup', { plan: 'pro' })}>Sign Up</button>;
 * }
 * ```
 */
export function usePlausible() {
  return {
    trackEvent(
      event: string,
      props?: Record<string, string | number | boolean>,
    ): void {
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(event, props ? { props } : undefined);
      }
    },
  };
}
