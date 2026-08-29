import Redis from "ioredis"

const redis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
        const delay = Math.min(times * 1000, 5000)
        console.log(`Redis retry #${times} in ${delay}ms`)
        return delay
    },
})

redis.on("connect", () => {
    console.log("REDIS: TCP connection established")
})

redis.on("ready", () => {
    console.log("REDIS: ready")
})

redis.on("error", (error) => {
    console.error("REDIS ERROR:", error.message)
})

redis.on("close", () => {
    console.log("REDIS: connection closed")
})

redis.on("reconnecting", (delay) => {
    console.log(`REDIS: reconnecting in ${delay}ms`)
})

export default redis