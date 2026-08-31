import axios from "axios";

const getStoredSessionId = () => {
    if (typeof window === "undefined") {
        return null
    }

    return window.localStorage.getItem("sessionId")
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "https://interview-ai-backend-new.onrender.com",
    withCredentials:true
})

api.interceptors.request.use((config) => {
    const sessionId = getStoredSessionId()

    if (sessionId) {
        config.headers["x-session-id"] = sessionId
    }

    config.metadata = config.metadata || {}
    config.metadata.retryCount = config.metadata.retryCount || 0

    return config
})

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const config = error.config

        if (!config || config.metadata?.retryCount >= 2) {
            return Promise.reject(error)
        }

        if (error.response?.status === 429) {
            config.metadata = config.metadata || {}
            config.metadata.retryCount = (config.metadata.retryCount || 0) + 1

            const retryAfter = parseInt(error.response.headers?.["retry-after"] || "3", 10)
            const delay = Math.min(retryAfter * 1000, 5000)

            await new Promise((r) => setTimeout(r, delay))

            return api(config)
        }

        return Promise.reject(error)
    }
)

export default api
