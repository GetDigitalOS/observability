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
export declare function PlausibleScript(props: PlausibleConfig): ReactElement | null;
//# sourceMappingURL=PlausibleScript.d.ts.map