import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import { connectDb } from "./configs/db.js";
import dns from 'dns'
import authRouter from "./routes/auth.route.js";



const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/",authRouter);



const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
    console.log(`Auth Service Started on ${PORT}`);
});