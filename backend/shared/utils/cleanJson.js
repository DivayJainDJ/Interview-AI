export function cleanJson(raw) {
    return String(raw)
        .replace(/<think>[\s\S]*?<\/think>/gi, "")
        .replace(/<think>[\s\S]*/gi, "")
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();
}

export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const circuitState = {
    failures: 0,
    lastFailure: 0,
    isOpen: false,
    threshold: 5,
    cooldownMs: 60_000,
};

export function resetCircuit() {
    circuitState.failures = 0;
    circuitState.isOpen = false;
}

function recordFailure() {
    circuitState.failures++;
    circuitState.lastFailure = Date.now();
    if (circuitState.failures >= circuitState.threshold) {
        circuitState.isOpen = true;
        console.error(
            `[CircuitBreaker] OPEN – ${circuitState.failures} consecutive failures. ` +
            `Cooling down for ${circuitState.cooldownMs / 1000}s.`
        );
    }
}

function isCircuitOpen() {
    if (!circuitState.isOpen) return false;

    const elapsed = Date.now() - circuitState.lastFailure;
    if (elapsed >= circuitState.cooldownMs) {
        circuitState.isOpen = false;
        circuitState.failures = 0;
        console.log("[CircuitBreaker] HALF-OPEN – allowing probe request");
        return false;
    }
    return true;
}

export async function invokeWithRetry(llm, prompt, maxAttempts = 5) {
    if (isCircuitOpen()) {
        throw new Error(
            "Groq API circuit breaker is OPEN – too many recent rate-limit errors. " +
            "Please try again later."
        );
    }

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const result = await llm.invoke(prompt);
            resetCircuit();
            return result;
        } catch (error) {
            const is429 =
                error?.status === 429 ||
                error?.message?.includes("429") ||
                error?.message?.toLowerCase().includes("rate_limit") ||
                error?.message?.toLowerCase().includes("rate limit") ||
                error?.message?.toLowerCase().includes("tokens per minute") ||
                error?.message?.toLowerCase().includes("requests per minute");

            if (is429 && attempt < maxAttempts) {
                recordFailure();

                let retryAfterSec = 15;
                const headerVal = error?.headers?.["retry-after"];
                if (headerVal) {
                    retryAfterSec = parseFloat(headerVal) || retryAfterSec;
                }
                const bodyMatch = error?.message?.match(
                    /try again in (\d+\.?\d*)s/i
                );
                if (bodyMatch) {
                    retryAfterSec = parseFloat(bodyMatch[1]) || retryAfterSec;
                }

                const backoffMs = Math.min(
                    2000 * Math.pow(2, attempt - 1),
                    60_000
                );
                const jitter = backoffMs * 0.25 * (Math.random() * 2 - 1);
                const waitMs = Math.max(
                    Math.ceil(retryAfterSec * 1000) + 1000,
                    backoffMs + jitter
                );

                console.warn(
                    `[Groq 429] Attempt ${attempt}/${maxAttempts} – ` +
                    `rate limited. Waiting ${Math.round(waitMs)}ms ` +
                    `(retry-after: ${retryAfterSec}s, backoff: ${Math.round(backoffMs)}ms)`
                );

                await sleep(waitMs);
                continue;
            }

            throw error;
        }
    }
}
