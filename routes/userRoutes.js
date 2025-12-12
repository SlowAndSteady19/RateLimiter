import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email/password required" });

  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ error: "User already exists" });

  const apiKey = uuid();
  user = await User.create({ email, password, apiKey });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ message: "User created", apiKey, token });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ message: "Login successful", token, apiKey: user.apiKey });
});

export default router;
