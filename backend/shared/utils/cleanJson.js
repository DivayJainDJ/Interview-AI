/**
 * Strip <think>...</think> blocks (including unclosed ones) and markdown
 * fences from an LLM response, then return clean JSON string.
 */
export function cleanJson(raw) {
    return String(raw)
        // remove closed think blocks
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        // remove unclosed think block — everything from <think> to end
        .replace(/<think>[\s\S]*/gi, "")
        // remove markdown fences
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
}
