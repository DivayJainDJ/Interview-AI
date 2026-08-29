import llm from "../config/llm.js"
import hrInterviewPrompt from "../prompts/hrInterviewPrompt.js"
import technicalInterviewPrompt from "../prompts/technicalInterviewPrompt.js"
import { cleanJson } from "../../../shared/utils/cleanJson.js"

export const interviewAgent = async (data) => {
    try {
        const prompt = data.type?.toLowerCase() === "hr" ? hrInterviewPrompt(data) : technicalInterviewPrompt(data)
        const response = await llm.invoke(prompt)
        return JSON.parse(cleanJson(response.content))
    } catch (error) {
        console.log("Interview Agent Parse Error", error);
        throw new Error("Failed to generate interview questions.");
    }
}
