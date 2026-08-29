import llm from "../config/llm.js";
import feedbackPrompt from "../prompts/feedbackPrompt.js";
import { cleanJson } from "../../../shared/utils/cleanJson.js";

export const feedbackAgent = async (data) => {
    try {
        const prompt = feedbackPrompt(data)
        const response = await llm.invoke(prompt)
        return JSON.parse(cleanJson(response.content))
    } catch (error) {
        console.log("Feedback Agent Parse Error", error);
        throw new Error("Failed to generate feedback");
    }
}
