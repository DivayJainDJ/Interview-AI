import express from "express"
import dotenv from "dotenv"
dotenv.config()
import proxy from "express-http-proxy"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { getCurrentUser } from "./controllers/user.controller.js"
import { isAuth } from "./middleware/isAuth.js"
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js"
const app = express()
app.use(express.json())

app.use(cors({
    origin:process.env.FRONTEND_URL,
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


app.use("/api/auth", async (req, res) => {
    try {
        const url = `${process.env.AUTH_SERVICE_URL}${req.originalUrl.replace("/api/auth", "")}`;

        const response = await fetch(url, {
            method: req.method,
            headers: {
                "content-type": req.headers["content-type"] || "application/json",
                cookie: req.headers.cookie || "",
            },
            body: ["GET", "HEAD"].includes(req.method)
                ? undefined
                : JSON.stringify(req.body),
        });

        const data = await response.text();

        // Forward cookies from Auth Service
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) {
            res.setHeader("set-cookie", setCookie);
        }

        res.status(response.status);

        res.setHeader(
            "content-type",
            response.headers.get("content-type") || "application/json"
        );

        res.send(data);
    } catch (error) {
        console.error("Auth proxy error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});
app.use("/api/resume" ,isAuth, proxyWithHeaders(process.env.RESUME_SERVICE_URL))
app.use("/api/interview",isAuth ,proxyWithHeaders(process.env.INTERVIEW_SERVICE_URL))
app.use("/api/roadmap",isAuth ,proxyWithHeaders(process.env.ROADMAP_SERVICE_URL))
app.use("/api/billing",isAuth ,proxyWithHeaders(process.env.BILLING_SERVICE_URL))
app.get("/api/me",isAuth,getCurrentUser)

app.use((error, req, res, next) => {
    console.error("gateway error", error)
    return res.status(500).json({ message: error.message })
})





const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Gateway Started on ${PORT}`);
});
