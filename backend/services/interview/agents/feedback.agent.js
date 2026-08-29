import llm from "../config/llm.js";
import feedbackPrompt from "../prompts/feedbackPrompt.js";
import { cleanJson } from "../../../shared/utils/cleanJson.js";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const feedbackAgent = async (data) => {
    const prompt = feedbackPrompt(data)
    let lastError
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const response = await llm.invoke(prompt)
            return JSON.parse(cleanJson(response.content))
        } catch (error) {
            lastError = error
            console.log(`Feedback Agent attempt ${attempt} failed:`, error.message)
            if (attempt < 3) await sleep(2000 * attempt)
        }
    }
    throw new Error("Failed to generate feedback")
}
