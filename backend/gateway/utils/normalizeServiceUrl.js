export const normalizeServiceUrl = (url) => {
    if (!url) {
        return url;
    }

    const trimmed = url.trim();

    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
        return trimmed.replace(/\/+$/, "");
    }

    // Render private network hostport, e.g. fresherai-auth:10000
    if (trimmed.includes(":") && !trimmed.includes(".")) {
        return `http://${trimmed}`;
    }

    // Render public hostname, e.g. fresherai-auth.onrender.com
    return `https://${trimmed}`;
};
