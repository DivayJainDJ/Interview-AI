import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import llm from "../configs/llm.js";
import searchVideo from "../configs/youtube.js";
import { cleanJson } from "../../../shared/utils/cleanJson.js";

// Wait for Groq TPM window to reset before making another large call
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const resourceAgent = async (state) => {
    try {
        const roadmap = state.roadmap;
        const modules = roadmap.modules || [];

        // Wait 12s to let the Groq TPM window reset after roadmapAgent's heavy call
        await sleep(12000);

        // Fetch docs in batches of 5 to stay under TPM limit
        const BATCH = 5;
        const docsMap = new Map();

        for (let i = 0; i < modules.length; i += BATCH) {
            const batch = modules.slice(i, i + BATCH);
            const titles = batch.map(m => m.title).join("\n");

            try {
                const docsResponse = await llm.invoke([
                    new SystemMessage(`You are an expert software engineer.
For every module title below, return the best official documentation URL.
Return ONLY valid JSON array. No explanation. No markdown.
Format: [{"title":"","article":""}]`),
                    new HumanMessage(`Modules:\n${titles}`)
                ]);

                const docs = JSON.parse(cleanJson(docsResponse.content));
                docs.forEach(item => {
                    if (item.title && item.article) {
                        docsMap.set(item.title.toLowerCase(), item.article);
                    }
                });
            } catch {
                // If docs fetch fails, continue without articles
            }

            // Small pause between batches
            if (i + BATCH < modules.length) await sleep(3000);
        }

        // Fetch YouTube videos in parallel (doesn't use Groq TPM)
        roadmap.modules = await Promise.all(
            modules.map(async (module) => {
                let video = null;
                try {
                    video = await searchVideo(module.title);
                } catch (err) {
                    console.log("YouTube search error:", err.message);
                }
                return {
                    ...module,
                    youtube: video?.url || "",
                    article: docsMap.get(module.title.toLowerCase()) || "",
                };
            })
        );

        return { ...state, roadmap };

    } catch (error) {
        console.log("Resource Agent Error:", error.message);
        // Return state without resources rather than failing the whole request
        return state;
    }
}

export default resourceAgent
