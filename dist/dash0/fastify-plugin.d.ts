type FastifyInstance = {
    addHook: (hook: string, handler: (...args: unknown[]) => void | Promise<void>) => void;
    decorateRequest: (name: string, value: unknown) => void;
};
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
export default function dash0Plugin(fastify: FastifyInstance): Promise<void>;
export {};
//# sourceMappingURL=fastify-plugin.d.ts.map