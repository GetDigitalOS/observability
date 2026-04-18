import { getDash0Token } from '../env.js';

type OTelApi = typeof import('@opentelemetry/api');
type Meter = ReturnType<OTelApi['metrics']['getMeter']>;

let meter: Meter | null = null;
let initialized = false;

async function getMeter(): Promise<Meter | null> {
  if (initialized) return meter;
  initialized = true;

  if (!getDash0Token()) return null;

  try {
    const { metrics } = await import('@opentelemetry/api');
    meter = metrics.getMeter('app-metrics');
    return meter;
  } catch {
    return null;
  }
}

/**
 * Increment a counter metric.
 * No-op if Dash0/OTel is not initialized.
 */
export async function incrementCounter(
  name: string,
  tags?: Record<string, string>,
): Promise<void> {
  const m = await getMeter();
  if (!m) return;
  const counter = m.createCounter(name);
  counter.add(1, tags);
}

/**
 * Record a histogram (distribution) metric.
 * Use for latencies, request sizes, etc.
 */
export async function recordHistogram(
  name: string,
  value: number,
  tags?: Record<string, string>,
): Promise<void> {
  const m = await getMeter();
  if (!m) return;
  const histogram = m.createHistogram(name);
  histogram.record(value, tags);
}

/**
 * Record a gauge metric (current value at a point in time).
 * Use for queue depths, active connections, etc.
 */
export async function recordGauge(
  name: string,
  value: number,
  tags?: Record<string, string>,
): Promise<void> {
  const m = await getMeter();
  if (!m) return;
  // OTel uses UpDownCounter for gauge-like behavior
  const gauge = m.createUpDownCounter(name);
  gauge.add(value, tags);
}

/**
 * Track a custom business metric with a service-specific prefix.
 * Equivalent to recordGauge with automatic prefix.
 */
export async function trackMetric(
  name: string,
  value: number,
  tags?: Record<string, string>,
): Promise<void> {
  const serviceName = process.env.OTEL_SERVICE_NAME ?? 'app';
  await recordGauge(`${serviceName}.${name}`, value, tags);
}
