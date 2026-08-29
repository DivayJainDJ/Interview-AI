import express from "express"
import dotenv from "dotenv"
dotenv.config()
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { getCurrentUser } from "./controllers/user.controller.js"
import { isAuth } from "./middleware/isAuth.js"
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js"

const app = express()
app.set("trust proxy", 1)
app.use(express.json())

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true
    }

    if (allowedOrigins.includes(origin)) {
        return true
    }

    try {
        const { hostname } = new URL(origin)
        return hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname.endsWith(".vercel.app")
    } catch {
        return false
    }
}

app.use(cors({
    origin(origin, callback) {
        if (allowedOrigins.length === 0 || isAllowedOrigin(origin)) {
            return callback(null, true)
        }

        return callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials: true
}))

app.use(morgan("dev"))
app.use(cookieParser())

app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "gateway" })
})

app.get("/", (_req, res) => {
    res.send("Hello from Gateway")
})

// Wake up all downstream services once on startup (Render free tier cold starts)
setTimeout(() => {
    const services = [
        process.env.AUTH_SERVICE_URL,
        process.env.RESUME_SERVICE_URL,
        process.env.INTERVIEW_SERVICE_URL,
        process.env.ROADMAP_SERVICE_URL,
        process.env.BILLING_SERVICE_URL,
    ].filter(Boolean);

    for (const url of services) {
        fetch(`${url}/health`, { signal: AbortSignal.timeout(15000) })
            .then(() => console.log(`Warmed: ${url}`))
            .catch(() => {});
    }
}, 3000);

app.use("/api/auth", proxyWithHeaders(process.env.AUTH_SERVICE_URL, "/api/auth"))
app.use("/api/resume", isAuth, proxyWithHeaders(process.env.RESUME_SERVICE_URL, "/api/resume"))
app.use("/api/interview", isAuth, proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL, "/api/interview"))
app.use("/api/roadmap", isAuth, proxyWithHeaders(process.env.ROADMAP_SERVICE_URL, "/api/roadmap"))
app.use("/api/billing/verify", proxyWithHeaders(process.env.BILLING_SERVICE_URL, "/api/billing"))
app.use("/api/billing", isAuth, proxyWithHeaders(process.env.BILLING_SERVICE_URL, "/api/billing"))
app.get("/api/me", isAuth, getCurrentUser)

app.use((error, req, res, next) => {
    console.error("gateway error", error)
    return res.status(500).json({ message: error.message })
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Gateway Started on ${PORT}`);
});
