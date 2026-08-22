import { createProxyMiddleware } from "http-proxy-middleware";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const proxyWithHeaders = (serviceUrl, routePrefix) => {
    if (!serviceUrl) {
        throw new Error(`Missing proxy target for route prefix "${routePrefix}"`);
    }

    const routeRegex = new RegExp(`^${escapeRegex(routePrefix)}`);

    return createProxyMiddleware({
        target: serviceUrl,
        changeOrigin: true,
        pathRewrite: (path) => {
            const rewrittenPath = path.replace(routeRegex, "");
            return rewrittenPath || "/";
        },
        on: {
            proxyReq: (proxyReq, req) => {
                if (req.user?.userId) {
                    proxyReq.setHeader("x-user-id", req.user.userId);
                }
            }
        }
    });
};
