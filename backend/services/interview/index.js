import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDB } from "./config/db.js"
import interviewRouter from "./routes/interview.route.js"
dotenv.config()

const app = express()

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 6003

app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "interview" });
});

app.get("/", (_req, res) => {
    res.send("Hello from Interview-service");
});


app.use("/", interviewRouter);


const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Interview-service Started on ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start Interview service:", error);
        process.exit(1);
    }
};

startServer();