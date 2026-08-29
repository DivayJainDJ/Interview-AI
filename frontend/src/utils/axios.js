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

    return config
})

export default api
