import express from "express";
import { rateLimiter } from "../middleware/rateLimiter.js";
import User from "../models/User.js";

const router = express.Router();

// Protected Rate Limited Route
router.post("/", rateLimiter(), (req, res) => {
  res.json({
    message: "Success! You accessed protected data.",
    remainingQuota: req.remainingQuota
  });
});

// Client Dashboard
router.get("/dashboard", async (req, res) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey) return res.status(401).json({ error: "No API key provided" });

  const user = await User.findOne({ apiKey });
  if (!user) return res.status(401).json({ error: "Invalid API key" });

  const currentTime = Date.now();
  const windowMs = 15 * 1000; // 15 sec window
  const maxRequests = 5;
  const recentRequests = user.requests.filter(
    r => currentTime - r.timestamp.getTime() < windowMs
  );

  res.json({
    email: user.email,
    requestsMade: recentRequests.length,
    remainingQuota: maxRequests - recentRequests.length,
    windowReset: Math.ceil(
      (windowMs - (currentTime - (recentRequests[0]?.timestamp?.getTime() || currentTime))) / 1000
    )
  });
});

export default router;
