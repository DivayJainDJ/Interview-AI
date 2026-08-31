import axios from "axios";

const getStoredSessionId = () => {
    if (typeof window === "undefined") {
        return null
    }

    return window.localStorage.getItem("sessionId")
}

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "https://interview-ai-backend-new.onrender.com",
    withCredentials: true
})

const pendingRequests = new Map()

api.interceptors.request.use((config) => {
    const sessionId = getStoredSessionId()
    if (sessionId) {
        config.headers["x-session-id"] = sessionId
    }

    if (config.method === "get") {
        const key = config.url
        if (pendingRequests.has(key)) {
            return Promise.reject({ __deduped: true, config })
        }
        pendingRequests.set(key, true)
    }

    return config
})

api.interceptors.response.use(
    (response) => {
        if (response.config.method === "get") {
            pendingRequests.delete(response.config.url)
        }
        return response
    },
    (error) => {
        if (error.config?.method === "get") {
            pendingRequests.delete(error.config.url)
        }

        if (error.__deduped) {
            return Promise.reject(error)
        }

        return Promise.reject(error)
    }
)

export default api
