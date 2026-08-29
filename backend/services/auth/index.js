import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors";
import { connectDb } from "./configs/db.js";
import dns from 'dns'
import authRouter from "./routes/auth.route.js";



const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(morgan("dev"));

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

app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "auth" });
});

app.use("/", authRouter);

const PORT = process.env.PORT || 8001;

const startServer = async () => {
    try {
        await connectDb();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Auth Service Started on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Auth Service:", error);
        process.exit(1);
    }
};

startServer();
