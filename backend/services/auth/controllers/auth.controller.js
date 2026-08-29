import crypto from "crypto";
import { getAuth } from "firebase-admin/auth";
import { app } from "../configs/firebase.js";
import User from "../model/user.model.js";
import redis from "../../../shared/redis/redis.js";

const getSessionId = (req) =>
  req.cookies?.session ||
  req.headers["x-session-id"];

const getSessionCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  };
};

const clearSessionCookie = (res) => {
  res.clearCookie("session", { ...getSessionCookieOptions() });
  res.clearCookie("session", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.clearCookie("session", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
};

const saveSession = async (sessionId, user) => {
  await redis.set(
    `session:${sessionId}`,
    JSON.stringify({
      userId: user._id,
      name: user.name,
      email: user.email,
      interviewCoin: user.interviewCoin,
    }),
    "EX",
    60 * 60 * 24 * 7
  );
};

export const login = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("auth login hit", { hasToken: Boolean(token) });

    const decoded = await getAuth(app).verifyIdToken(token);
    console.log("firebase token verified", { uid: decoded.uid });

    let user = await User.findOne({
      firebaseUid: decoded.uid,
    });

    if (!user) {
      user = await User.create({
        firebaseUid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      });
    } else {
      user.name = decoded.name || user.name;
      user.email = decoded.email || user.email;
      await user.save();
    }

    const sessionId = crypto.randomUUID();
    await saveSession(sessionId, user);

    res.cookie("session", sessionId, {
      ...getSessionCookieOptions(),
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.json({ success: true, user, sessionId });
  } catch (error) {
    console.log("auth login failed", error);
    return res.status(401).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    if (sessionId) {
      await redis.del(`session:${sessionId}`);
    }

    clearSessionCookie(res);

    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const useInterviewCoins = async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    const sessionData = JSON.parse(session);
    const { coins, action } = req.body;

    if (!coins) {
      return res.status(400).json({
        success: false,
        message: "Coins are required",
      });
    }

    const user = await User.findById(sessionData.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.interviewCoin < coins) {
      return res.status(403).json({
        success: false,
        message: "Not enough interview coins",
        interviewCoin: user.interviewCoin,
      });
    }

    user.interviewCoin -= coins;
    await user.save();
    await saveSession(sessionId, user);

    return res.status(200).json({
      success: true,
      message: "Interview coins updated successfully",
      action,
      interviewCoin: user.interviewCoin,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addCoins = async (req, res) => {
  try {
    const sessionId = getSessionId(req);

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const session = await redis.get(`session:${sessionId}`);

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
      });
    }

    const sessionData = JSON.parse(session);
    const { coins } = req.body;

    if (!coins || coins <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid coins are required",
      });
    }

    const user = await User.findById(sessionData.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.interviewCoin += Number(coins);
    await user.save();
    await saveSession(sessionId, user);

    return res.status(200).json({
      success: true,
      message: "Coins added successfully",
      interviewCoin: user.interviewCoin,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
