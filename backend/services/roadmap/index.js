import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./configs/db.js"
import roadmapRouter from "./routes/roadmap.route.js"
dotenv.config()

const app = express()
app.use(express.json())

const PORT = process.env.PORT || 6004

app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "roadmap" });
});

app.use("/", roadmapRouter);

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Roadmap-service Started on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Roadmap service:", error);
        process.exit(1);
    }
};

startServer();