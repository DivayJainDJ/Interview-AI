import redis from "../../shared/redis/redis.js"

const getSessionId = (req) =>
    req.cookies?.session ||
    req.headers["x-session-id"]


    export const isAuth = async (req, res, next) => {
        try {
            const sessionId =
                req.cookies?.session ||
                req.headers["x-session-id"]
    
            if (!sessionId) {
                return res.status(401).json({
                    message: "Unauthorized"
                })
            }
    
            console.log("AUTH: checking Redis session")
    
            const session = await redis.get(`session:${sessionId}`)
    
            console.log("AUTH: Redis session lookup completed")
    
            if (!session) {
                return res.status(401).json({
                    message: "Session Expired"
                })
            }
    
            const user = JSON.parse(session)
    
            if (
                typeof user.interviewCoin !== "number" ||
                user.interviewCoin < 150
            ) {
                user.interviewCoin = 150
            }
    
            req.user = user
    
            next()
    
        } catch (error) {
            console.error("AUTH REDIS ERROR:", error)
    
            return res.status(500).json({
                message: "Authentication service unavailable"
            })
        }
    }