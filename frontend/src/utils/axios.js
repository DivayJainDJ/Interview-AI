import axios from "axios";


const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "https://interview-ai-backend-new.onrender.com",
    withCredentials:true
})

export default api
