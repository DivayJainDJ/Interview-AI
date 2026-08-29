import { HumanMessage, SystemMessage } from "@langchain/core/messages"
import llm from "../config/llm.js"
import { cleanJson, invokeWithRetry } from "../../../shared/utils/cleanJson.js"

export const resumeAgent = async (resumeText) => {
    const response = await invokeWithRetry(llm, [
        new SystemMessage(`You are an Expert ATS Resume Analyzer.
Analyze the resume and return ONLY valid JSON. No markdown. No explanation.

{
  "name":"","email":"","phone":"","summary":"",
  "skills":[],"projects":[],"education":[],"experience":[],
  "strengths":[],"weaknesses":[],"missingSkills":[],
  "suggestedRole":"","score":0,"recommendations":[]
}`),
        new HumanMessage(resumeText),
    ])

    const cleaned = cleanJson(response.content)
    // Validate JSON
    JSON.parse(cleaned)
    return cleaned
}
