import type { Dash0Config } from '../types.js';
/**
 * Initialize OpenTelemetry with the Dash0 exporter.
 * Only loads if DASH0_AUTH_TOKEN is set. Safe to call unconditionally.
 *
 * IMPORTANT: Call this BEFORE any other imports that should be traced.
 * OTel needs to patch modules (http, pg, etc.) before they are loaded.
 */
export declare function initDash0(config?: Dash0Config): Promise<void>;
//# sourceMappingURL=server.d.ts.map