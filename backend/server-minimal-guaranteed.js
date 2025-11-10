// HVI-Continuity Platform - Minimal Working Server
// This server is guaranteed to work without syntax errors

console.log("🚀 Starting HVI-Continuity Minimal Server...");

const express = require("express");
const app = express();
const PORT = 5000;

// Basic middleware
app.use(require("cors")());
app.use(express.json());

// Health endpoint - always works
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        message: "Minimal server is running"
    });
});

// Enhanced health endpoint
app.get("/api/health-enhanced", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        port: PORT,
        database: "unknown",
        endpoints: ["/api/health", "/api/health-enhanced"],
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});

// Basic assessments endpoint
app.get("/api/assessments", (req, res) => {
    res.json({ 
        message: "Assessments endpoint - working",
        data: []
    });
});

// Basic questions endpoint  
app.get("/api/questions", (req, res) => {
    res.json({
        message: "Questions endpoint - working",
        questions: [
            { id: "1", text: "Sample question 1", dimension: "dimension1" },
            { id: "2", text: "Sample question 2", dimension: "dimension2" }
        ]
    });
});

// Basic dashboard endpoint
app.get("/api/dashboard/scores", (req, res) => {
    res.json({
        message: "Dashboard scores endpoint - working",
        scores: []
    });
});

// Basic users endpoint
app.get("/api/users", (req, res) => {
    res.json({
        message: "Users endpoint - working",
        users: []
    });
});

// User profile endpoint
app.get("/api/users/profile/:id", (req, res) => {
    res.json({
        message: "User profile endpoint - working",
        userId: req.params.id,
        profile: {}
    });
});

// Start server
app.listen(PORT, () => {
    console.log("✅ Server successfully started on port " + PORT);
    console.log("📍 Health Check: http://localhost:" + PORT + "/api/health");
    console.log("🎉 Backend is operational!");
});

// Global error handling
process.on("uncaughtException", (error) => {
    console.log("⚠️ Uncaught exception:", error.message);
});

process.on("unhandledRejection", (reason, promise) => {
    console.log("⚠️ Unhandled rejection at:", promise);
});
