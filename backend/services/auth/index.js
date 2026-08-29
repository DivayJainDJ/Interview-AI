import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { connectDb } from "./configs/db.js";
import dns from 'dns'
import authRouter from "./routes/auth.route.js";



const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(morgan("dev"));

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
