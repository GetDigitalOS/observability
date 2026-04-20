import type { Dash0Config } from '../types.js';
import { getDash0Token, isProduction } from '../env.js';

/**
 * Initialize OpenTelemetry with the Dash0 exporter.
 * Only loads if DASH0_AUTH_TOKEN is set. Safe to call unconditionally.
 *
 * IMPORTANT: Call this BEFORE any other imports that should be traced.
 * OTel needs to patch modules (http, pg, etc.) before they are loaded.
 */
export async function initDash0(config?: Dash0Config): Promise<void> {
  const authToken = config?.authToken ?? getDash0Token();
  if (!authToken) return;

  const prod = isProduction();
  const serviceName =
    config?.serviceName ??
    process.env.OTEL_SERVICE_NAME ??
    'unknown-service';
  const environment = config?.environment ?? (prod ? 'production' : 'development');
  const endpoint = config?.endpoint ?? 'https://ingress.us-west-2.aws.dash0.com';

  try {
    const { NodeSDK } = await import('@opentelemetry/sdk-node');
    const { OTLPTraceExporter } = await import(
      '@opentelemetry/exporter-trace-otlp-http'
    );
    const { OTLPMetricExporter } = await import(
      '@opentelemetry/exporter-metrics-otlp-http'
    );
    const { PeriodicExportingMetricReader } = await import(
      '@opentelemetry/sdk-metrics'
    );
    const { resourceFromAttributes } = await import('@opentelemetry/resources');
    const { ATTR_SERVICE_NAME } = await import(
      '@opentelemetry/semantic-conventions'
    );
    // Dynamic import with string variable to avoid tsc resolving at build time
    const autoInstrModule = '@opentelemetry/auto-instrumentations-node';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { getNodeAutoInstrumentations } = await import(autoInstrModule) as {
      getNodeAutoInstrumentations: (config?: Record<string, unknown>) => any[];
    };

    const headers = { Authorization: `Bearer ${authToken}` };

    const traceExporter = new OTLPTraceExporter({
      url: `${endpoint}/v1/traces`,
      headers,
    });

    const metricExporter = new OTLPMetricExporter({
      url: `${endpoint}/v1/metrics`,
      headers,
    });

    const sdk = new NodeSDK({
      resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: serviceName,
        'deployment.environment': environment,
      }),
      traceExporter,
      metricReader: new PeriodicExportingMetricReader({
        exporter: metricExporter,
        exportIntervalMillis: 30_000,
      }),
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': { enabled: false },
        }),
      ],
    });

    sdk.start();

    // Graceful shutdown
    const shutdown = async () => {
      await sdk.shutdown();
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch {
    // OTel dependencies not installed — skip silently
  }
}
