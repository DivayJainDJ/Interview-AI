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

/**
 * Sleep for ms milliseconds
 */
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/**
 * Invoke an LLM with automatic retry on rate limit (429) errors.
 * Reads the retry-after header and waits accordingly.
 */
export async function invokeWithRetry(llm, prompt, maxAttempts = 4) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await llm.invoke(prompt);
        } catch (error) {
            const is429 = error?.status === 429 ||
                error?.message?.includes("429") ||
                error?.message?.includes("rate_limit") ||
                error?.message?.includes("Rate limit");

            if (is429 && attempt < maxAttempts) {
                // Read retry-after from error headers, default to 15s
                const retryAfter = parseInt(
                    error?.headers?.["retry-after"] ||
                    error?.error?.error?.message?.match(/(\d+\.?\d*)s/)?.[1] ||
                    "15"
                );
                const waitMs = Math.ceil(retryAfter) * 1000 + 500;
                console.log(`Rate limited. Waiting ${waitMs}ms before retry ${attempt + 1}/${maxAttempts}`);
                await sleep(waitMs);
                continue;
            }
            throw error;
        }
    }
}
