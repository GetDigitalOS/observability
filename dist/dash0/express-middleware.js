import { getDash0Token } from '../env.js';
/**
 * Express middleware that enriches OTel spans with request metadata.
 * OTel auto-instrumentation handles basic HTTP spans; this middleware
 * adds route-specific attributes.
 *
 * Usage:
 * ```ts
 * import { dash0Middleware } from '@getdigital/observability/dash0/express';
 * app.use(dash0Middleware());
 * ```
 */
export function dash0Middleware() {
    if (!getDash0Token()) {
        return (_req, _res, next) => next();
    }
    let traceApi = null;
    const apiPromise = import('@opentelemetry/api')
        .then((mod) => { traceApi = mod; })
        .catch(() => { });
    return (req, res, next) => {
        if (!traceApi) {
            next();
            return;
        }
        const span = traceApi.trace.getActiveSpan();
        if (span) {
            if (req.path)
                span.setAttribute('http.route', req.path);
            const startTime = Date.now();
            res.on('finish', () => {
                span.setAttribute('http.response_time_ms', Date.now() - startTime);
                if (res.statusCode)
                    span.setAttribute('http.status_code', res.statusCode);
            });
        }
        next();
    };
}
//# sourceMappingURL=express-middleware.js.map