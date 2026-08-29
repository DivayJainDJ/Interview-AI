import axios from "axios"
import api from "../utils/axios"

const resumeApi = axios.create({
    baseURL: import.meta.env.VITE_RESUME_URL || "https://interview-ai-resume-f4up.onrender.com",
    withCredentials: true
})

resumeApi.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const sessionId = window.localStorage.getItem("sessionId")
        if (sessionId) {
            config.headers["x-session-id"] = sessionId
        }
    }

    return config
})

export const getResume = async () => {
    try {
        const response = await resumeApi.get("/get-resume")
        
        return response.data
    } catch {
        return null
    }
    
}
