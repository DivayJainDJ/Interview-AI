import llm from "../config/llm.js"
import hrInterviewPrompt from "../prompts/hrInterviewPrompt.js"
import technicalInterviewPrompt from "../prompts/technicalInterviewPrompt.js"
import { cleanJson } from "../../../shared/utils/cleanJson.js"

export const interviewAgent = async (data) => {
    const prompt = data.type?.toLowerCase() === "hr"
        ? hrInterviewPrompt(data)
        : technicalInterviewPrompt(data)

    let lastError
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await llm.invoke(prompt)
            const parsed = JSON.parse(cleanJson(response.content))
            if (!Array.isArray(parsed) || parsed.length === 0) {
                throw new Error("Empty questions array")
            }
            return parsed
        } catch (error) {
            lastError = error
            console.log(`Interview Agent attempt ${attempt} failed:`, error.message)
            if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt))
        }
    }
    throw new Error("Failed to generate interview questions.")
}
