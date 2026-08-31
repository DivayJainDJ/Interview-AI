const clients = new Map();

export const rateLimiter = (maxRequests = 10, windowMs = 60_000) => {
    return (req, res, next) => {
        const key = req.headers["x-user-id"] || req.ip || "anonymous";
        const now = Date.now();

        if (!clients.has(key)) {
            clients.set(key, { count: 1, resetAt: now + windowMs });
            return next();
        }

        const client = clients.get(key);

        if (now > client.resetAt) {
            client.count = 1;
            client.resetAt = now + windowMs;
            return next();
        }

        client.count++;

        if (client.count > maxRequests) {
            const retryAfter = Math.ceil((client.resetAt - now) / 1000);
            res.setHeader("Retry-After", retryAfter);
            return res.status(429).json({
                message: `Too many requests. Please retry in ${retryAfter}s.`,
            });
        }

        next();
    };
};

setInterval(() => {
    const now = Date.now();
    for (const [key, client] of clients) {
        if (now > client.resetAt) {
            clients.delete(key);
        }
    }
}, 60_000);
