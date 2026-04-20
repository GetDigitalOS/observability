type NextFunction = () => void;
type Request = {
    method?: string;
    url?: string;
    path?: string;
};
type Response = {
    statusCode?: number;
    on: (event: string, cb: () => void) => void;
};
type Middleware = (req: Request, res: Response, next: NextFunction) => void;
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
export declare function dash0Middleware(): Middleware;
export {};
//# sourceMappingURL=express-middleware.d.ts.map