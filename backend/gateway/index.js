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
app.use(express.json())

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }

        return callback(new Error(`Origin ${origin} not allowed by CORS`))
    },
    credentials:true
}))

app.use(morgan("dev"))
app.use(cookieParser())

app.use("/api/auth", (req, res, next) => {
    console.log("gateway auth route hit", {
        method: req.method,
        url: req.originalUrl,
    })
    next()
})

app.get("/" , (req,res)=>{
    res.send("Hello from Gateway")
})

app.use("/api/auth", proxyWithHeaders(process.env.AUTH_SERVICE_URL, "/api/auth"))
app.use("/api/resume" ,isAuth, proxyWithHeaders(process.env.RESUME_SERVICE_URL, "/api/resume"))
app.use("/api/interview",isAuth ,proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL, "/api/interview"))
app.use("/api/roadmap",isAuth ,proxyWithHeaders(process.env.ROADMAP_SERVICE_URL, "/api/roadmap"))
app.use("/api/billing",isAuth ,proxyWithHeaders(process.env.BILLING_SERVICE_URL, "/api/billing"))
app.get("/api/me",isAuth,getCurrentUser)

app.use((error, req, res, next) => {
    console.error("gateway error", error)
    return res.status(500).json({ message: error.message })
})





const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Gateway Started on ${PORT}`);
});
