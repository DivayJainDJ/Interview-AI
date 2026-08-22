import { createProxyMiddleware } from "http-proxy-middleware";

export const proxyWithHeaders = (serviceUrl) => {
    return createProxyMiddleware({
        target: serviceUrl,
        changeOrigin: true,
        pathRewrite: (path) => path,
        on: {
            proxyReq: (proxyReq, req) => {
                if (req.user?.userId) {
                    proxyReq.setHeader("x-user-id", req.user.userId);
                }
            }
        }
    });
};