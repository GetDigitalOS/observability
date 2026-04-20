/**
 * Increment a counter metric.
 * No-op if Dash0/OTel is not initialized.
 */
export declare function incrementCounter(name: string, tags?: Record<string, string>): Promise<void>;
/**
 * Record a histogram (distribution) metric.
 * Use for latencies, request sizes, etc.
 */
export declare function recordHistogram(name: string, value: number, tags?: Record<string, string>): Promise<void>;
/**
 * Record a gauge metric (current value at a point in time).
 * Use for queue depths, active connections, etc.
 */
export declare function recordGauge(name: string, value: number, tags?: Record<string, string>): Promise<void>;
/**
 * Track a custom business metric with a service-specific prefix.
 * Equivalent to recordGauge with automatic prefix.
 */
export declare function trackMetric(name: string, value: number, tags?: Record<string, string>): Promise<void>;
//# sourceMappingURL=metrics.d.ts.map