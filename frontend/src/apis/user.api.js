import axios from "axios"
import api from "../utils/axios"
import { auth } from "../utils/firebase"
import { signOut } from "firebase/auth"

const authApi = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL || "https://interview-ai-auth.onrender.com",
    withCredentials: true
})

authApi.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const sessionId = window.localStorage.getItem("sessionId")
        if (sessionId) {
            config.headers["x-session-id"] = sessionId
        }
    }

    return config
})

export const loginWithFirebaseToken = async (token) => {
    const response = await authApi.post("/login", { token })
    const sessionId = response?.data?.sessionId

    if (sessionId && typeof window !== "undefined") {
        window.localStorage.setItem("sessionId", sessionId)
    }

    return response.data
}

export const logoutUser = async () => {
    try {
        await authApi.get("/logout")
    } finally {
        if (typeof window !== "undefined") {
            window.localStorage.removeItem("sessionId")
        }

        await signOut(auth).catch(() => {})
    }
}

export const getCurrentUser = async () => {
    try {
        const response = await api.get("/api/me")
        return response.data
    } catch {
        return null
    }
}

export const spendCoins = async (data)=>{
    try {
        const response = await authApi.post("/use-coins" , data)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error)
        
        throw error;
    }
}

export const shouldBlockOnCoinError = (error) => {
    const status = error?.response?.status
    return status === 400 || status === 401 || status === 403
}
