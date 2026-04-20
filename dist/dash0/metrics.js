import { getDash0Token } from '../env.js';
let meter = null;
let initialized = false;
async function getMeter() {
    if (initialized)
        return meter;
    initialized = true;
    if (!getDash0Token())
        return null;
    try {
        const { metrics } = await import('@opentelemetry/api');
        meter = metrics.getMeter('app-metrics');
        return meter;
    }
    catch {
        return null;
    }
}
/**
 * Increment a counter metric.
 * No-op if Dash0/OTel is not initialized.
 */
export async function incrementCounter(name, tags) {
    const m = await getMeter();
    if (!m)
        return;
    const counter = m.createCounter(name);
    counter.add(1, tags);
}
/**
 * Record a histogram (distribution) metric.
 * Use for latencies, request sizes, etc.
 */
export async function recordHistogram(name, value, tags) {
    const m = await getMeter();
    if (!m)
        return;
    const histogram = m.createHistogram(name);
    histogram.record(value, tags);
}
/**
 * Record a gauge metric (current value at a point in time).
 * Use for queue depths, active connections, etc.
 */
export async function recordGauge(name, value, tags) {
    const m = await getMeter();
    if (!m)
        return;
    // OTel uses UpDownCounter for gauge-like behavior
    const gauge = m.createUpDownCounter(name);
    gauge.add(value, tags);
}
/**
 * Track a custom business metric with a service-specific prefix.
 * Equivalent to recordGauge with automatic prefix.
 */
export async function trackMetric(name, value, tags) {
    const serviceName = process.env.OTEL_SERVICE_NAME ?? 'app';
    await recordGauge(`${serviceName}.${name}`, value, tags);
}
//# sourceMappingURL=metrics.js.map