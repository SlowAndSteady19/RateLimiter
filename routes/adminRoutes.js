import express from "express";
import User from "../models/User.js";

const router = express.Router();

// List all users (for admin)
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password -requests");
  res.json(users);
});

export default router;
