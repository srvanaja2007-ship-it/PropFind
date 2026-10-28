/**
 * HomeFinder - Express Server Entry Point
 * Day 3 Topic: Node.js, Express, REST API & Static Hosting
 * Author: Person 2 (Backend Developer)
 */
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Initialize Database connection
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets from /public folder
app.use(express.static(path.join(__dirname, "public")));

// REST API Routes
app.use("/api/properties", require("./routes/properties"));
app.use("/api/messages", require("./routes/messages"));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Fallback for root path to ensure index.html is served
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Global 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API endpoint not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 HomeFinder Server running at: http://localhost:${PORT}`);
  console.log(`🏠 Open in your browser: http://localhost:${PORT}`);
  console.log(`📡 REST API active at: http://localhost:${PORT}/api/properties`);
  console.log(`=======================================================`);
});

module.exports = app;
