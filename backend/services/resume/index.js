import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { connectDB } from "./config/db.js"
import resumeRouter from "./routes/resume.route.js"

dotenv.config()

const app = express()

app.use(express.json())

const allowedOrigins = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) {
        return true;
    }

    if (allowedOrigins.includes(origin)) {
        return true;
    }

    try {
        const { hostname } = new URL(origin);
        return hostname === "localhost" ||
            hostname === "127.0.0.1" ||
            hostname.endsWith(".vercel.app");
    } catch {
        return false;
    }
};

app.use(cors({
    origin(origin, callback) {
        if (allowedOrigins.length === 0 || isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
}));

app.options("*", cors({
    origin(origin, callback) {
        if (allowedOrigins.length === 0 || isAllowedOrigin(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
}));


const PORT = process.env.PORT || 6002

app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "resume" });
});

app.get("/", (_req, res) => {
    res.send("Hello from Resume-service");
});

app.use("/", resumeRouter);

const startServer = async () => {
    try {
        await connectDB()

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Resume-service Started on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Resume service:", error)
        process.exit(1)
    }
}

startServer()
