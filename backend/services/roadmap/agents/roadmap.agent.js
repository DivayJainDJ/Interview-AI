import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../configs/llm.js";
import roadmapPrompt from "../configs/roadmap.prompt.js";
import { cleanJson } from "../../../shared/utils/cleanJson.js";

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const roadmapAgent = async (state) => {
    let lastError
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const resume = state.useResume
                ? {
                    skills: state.resume.skills,
                    missingSkills: state.resume.missingSkills,
                    projects: state.resume.projects,
                    experience: state.resume.experience,
                    score: state.resume.score,
                    suggestedRole: state.resume.suggestedRole,
                    recommendations: state.resume.recommendations,
                }
                : null;

            const response = await llm.invoke([
                new SystemMessage(roadmapPrompt),
                new HumanMessage(`
Target Role:
${state.role}

Target Package:
${state.targetPackage}

Resume:
${JSON.stringify(resume, null, 2)}

`)
            ]);

            const roadmap = JSON.parse(cleanJson(response.content));

            const capitalize = (value = "") =>
                value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

            roadmap.level = capitalize(roadmap.level);
            roadmap.modules = (roadmap.modules || []).map((module) => ({
                ...module,
                difficulty: capitalize(module.difficulty),
            }));

            return { ...state, roadmap };

        } catch (error) {
            lastError = error
            console.log(`Roadmap Agent attempt ${attempt} failed:`, error.message)
            if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt))
        }
    }
    console.log("Roadmap Agent Error:", lastError);
    throw lastError;
}

export default roadmapAgent
