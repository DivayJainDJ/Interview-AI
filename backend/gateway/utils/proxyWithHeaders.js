import { createProxyMiddleware } from "http-proxy-middleware";
import { normalizeServiceUrl } from "./normalizeServiceUrl.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const proxyWithHeaders = (serviceUrl, routePrefix) => {
    const target = normalizeServiceUrl(serviceUrl);

    if (!target) {
        throw new Error(`Missing proxy target for route prefix "${routePrefix}"`);
    }

    const routeRegex = new RegExp(`^${escapeRegex(routePrefix)}`);

    return createProxyMiddleware({
        target,
        changeOrigin: true,
        proxyTimeout: 300000,
        timeout: 300000,
        pathRewrite: (path) => {
            const rewrittenPath = path.replace(routeRegex, "");
            return rewrittenPath || "/";
        },
        on: {
            proxyReq: (proxyReq, req) => {
                if (req.user?.userId) {
                    proxyReq.setHeader("x-user-id", req.user.userId);
                }
            },
            error: (error, req, res) => {
                console.error(`proxy error [${routePrefix}] -> ${target}`, error.message);

                if (!res.headersSent) {
                    // Manually set CORS headers so the browser can read the error
                    const origin = req.headers.origin;
                    if (origin) {
                        res.setHeader("Access-Control-Allow-Origin", origin);
                        res.setHeader("Access-Control-Allow-Credentials", "true");
                    }
                    res.status(502).json({
                        message: `Service unavailable for ${routePrefix}. Please try again in a moment.`,
                    });
                }
            },
        },
    });
};
