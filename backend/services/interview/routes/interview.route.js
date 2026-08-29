import express from "express"
import { getAllInterviews, getInterview, startInterview, submitAnswer } from "../controllers/interview.controller.js"
import { isAuth } from "../middleware/isAuth.js"

const interviewRouter = express.Router()

interviewRouter.post("/start", isAuth, startInterview)

interviewRouter.post("/answer", isAuth, submitAnswer)

interviewRouter.get("/all", isAuth, getAllInterviews)

interviewRouter.get("/:id", isAuth, getInterview)


export default interviewRouter
