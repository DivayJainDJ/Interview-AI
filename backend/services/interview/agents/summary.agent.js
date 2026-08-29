import llm from "../config/llm.js";
import summaryPrompt from "../prompts/summaryPrompt.js";
import { cleanJson } from "../../../shared/utils/cleanJson.js";

export const summaryAgent = async (data) => {
    try {
        const prompt = summaryPrompt(data)
        const response = await llm.invoke(prompt)
        return JSON.parse(cleanJson(response.content))
    } catch (error) {
        console.log("Summary Agent Parse Error", error);
        throw new Error("Failed to generate Summary");
    }
}
