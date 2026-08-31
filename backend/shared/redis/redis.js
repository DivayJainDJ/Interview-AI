import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        const delay = Math.min(times * 1000, 5000)
        console.log(`Redis retry #${times} in ${delay}ms`)
        return delay
    },
})

redis.on("error", (error) => {
    console.error("REDIS ERROR:", error.message)
})

export default redis
