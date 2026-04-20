import { getDash0Token } from '../env.js';
/**
 * Fastify plugin that adds request-level span attributes for richer trace data.
 * OTel auto-instrumentation handles basic HTTP spans; this plugin enriches them
 * with route-specific metadata.
 *
 * Usage:
 * ```ts
 * import dash0Plugin from '@getdigital/observability/dash0/fastify';
 * fastify.register(dash0Plugin);
 * ```
 */
export default async function dash0Plugin(fastify) {
    if (!getDash0Token())
        return;
    let traceApi = null;
    try {
        traceApi = await import('@opentelemetry/api');
    }
    catch {
        return;
    }
    const api = traceApi;
    fastify.addHook('onRequest', async (...args) => {
        const span = api.trace.getActiveSpan();
        if (!span)
            return;
        const request = args[0];
        if (request?.routeOptions?.url) {
            span.setAttribute('http.route', request.routeOptions.url);
        }
        if (request?.id) {
            span.setAttribute('request.id', String(request.id));
        }
    });
    fastify.addHook('onResponse', async (...args) => {
        const span = api.trace.getActiveSpan();
        if (!span)
            return;
        const reply = args[1];
        if (reply?.statusCode) {
            span.setAttribute('http.status_code', reply.statusCode);
        }
        if (reply?.elapsedTime) {
            span.setAttribute('http.response_time_ms', reply.elapsedTime);
        }
    });
}
//# sourceMappingURL=fastify-plugin.js.map