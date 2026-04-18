import type { PlausibleConfig } from '../types.js';
import type { ReactElement } from 'react';

/**
 * React component that renders the Plausible Analytics script tag.
 * Returns null if no domain is configured, making it safe to include unconditionally.
 *
 * Usage in Next.js layout.tsx:
 * ```tsx
 * import { PlausibleScript } from '@getdigital/observability/plausible';
 * // In <head>:
 * <PlausibleScript />
 * ```
 *
 * For self-hosted Plausible:
 * ```tsx
 * <PlausibleScript scriptUrl="https://analytics.yourdomain.com/js/script.js" />
 * ```
 */
export function PlausibleScript(props: PlausibleConfig): ReactElement | null {
  const domain =
    props.domain ??
    (typeof process !== 'undefined'
      ? process.env?.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
      : undefined);

  if (!domain) return null;

  const src = props.scriptUrl ?? 'https://plausible.io/js/script.js';

  return (
    <script
      defer
      data-domain={domain}
      src={src}
    />
  );
}
