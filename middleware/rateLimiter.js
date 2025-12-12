import User from "../models/User.js";

export const rateLimiter = (maxRequests = 5, windowMs = 15 * 1000) => {
  return async (req, res, next) => {
    const apiKey = req.header("x-api-key");
    if (!apiKey) return res.status(401).json({ error: "No API key provided" });

    const user = await User.findOne({ apiKey });
    if (!user) return res.status(401).json({ error: "Invalid API key" });

    const currentTime = Date.now();

    // Filter old requests outside the window
    user.requests = user.requests.filter(
      r => currentTime - r.timestamp.getTime() < windowMs
    );

    if (user.requests.length >= maxRequests)
      return res.status(429).json({
        error: `Rate limit exceeded, try after ${Math.ceil(windowMs / 1000)} sec`
      });

    user.requests.push({ timestamp: new Date() });
    await user.save();

    req.user = user;
    req.remainingQuota = maxRequests - user.requests.length;

    next();
  };
};
