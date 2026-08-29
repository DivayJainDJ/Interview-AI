import redis from "../../../shared/redis/redis.js";

const getSessionId = (req) =>
    req.cookies?.session ||
    req.headers["x-session-id"];

    export const isAuth = async (req, res, next) => {
        try {
          const sessionId = getSessionId(req);
      
          console.log("INTERVIEW AUTH:", {
            hasSession: !!sessionId,
            userId: req.user?.userId,
            url: req.originalUrl,
          });
      
          if (!sessionId) {
            return res.status(401).json({ message: "Unauthorized" });
          }
      
          const session = await redis.get(`session:${sessionId}`);
      
          if (!session) {
            return res.status(401).json({ message: "Session Expired" });
          }
      
          req.user = JSON.parse(session);
      
          next();
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      };