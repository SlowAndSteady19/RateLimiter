import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { connectDB } from "./config/db.js";
// import { connectRedis } from "./config/redis.js";

dotenv.config();
const app = express();
app.use(express.json());

// Connect MongoDB
connectDB();

// Connect Redis (optional if you plan sliding window later)
//connectRedis();

// Routes
app.get("/api", (req, res) => {
  res.send("🎉 SmartRateLimiter API is live! Visit /api/users/signup to get started.");
});


app.use("/api/users", userRoutes);
app.use("/api/data", apiRoutes);
app.use("/api/admin", adminRoutes);

// Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
export default app;