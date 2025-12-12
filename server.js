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
// Homepage for Vercel
// Homepage for Vercel with clickable buttons
app.get("/", (req, res) => {
  res.send(`
    <h1> SmartRateLimiter API is live!</h1>
    <p>Use the buttons below to test your endpoints:</p>
    
    <button onclick="signup()">Signup</button>
    <button onclick="login()">Login</button>
    <button onclick="getData()">Rate-Limited Data</button>
    <button onclick="dashboard()">Dashboard</button>
    <button onclick="admin()">Admin Users</button>

    <pre id="result" style="margin-top:20px; padding:10px; background:#f0f0f0;"></pre>

    <script>
      const apiBase = "/api";

      async function signup() {
        const res = await fetch(apiBase + "/users/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@example.com", password: "123456" })
        });
        document.getElementById("result").innerText = await res.text();
      }

      async function login() {
        const res = await fetch(apiBase + "/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@example.com", password: "123456" })
        });
        document.getElementById("result").innerText = await res.text();
      }

      async function getData() {
        const apiKey = prompt("Enter your API Key:");
        const res = await fetch(apiBase + "/data", {
          method: "POST",
          headers: { "x-api-key": apiKey }
        });
        document.getElementById("result").innerText = await res.text();
      }

      async function dashboard() {
        const apiKey = prompt("Enter your API Key:");
        const res = await fetch(apiBase + "/data/dashboard", {
          headers: { "x-api-key": apiKey }
        });
        document.getElementById("result").innerText = await res.text();
      }

      async function admin() {
        const res = await fetch(apiBase + "/admin/users");
        document.getElementById("result").innerText = await res.text();
      }
    </script>
  `);
});



app.use("/api/users", userRoutes);
app.use("/api/data", apiRoutes);
app.use("/api/admin", adminRoutes);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
//Start server
//app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
//export default app;