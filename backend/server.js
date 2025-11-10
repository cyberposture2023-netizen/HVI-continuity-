// HVI-Continuity Platform - Clean Main Server
// Fixed version without syntax errors

console.log("🚀 Starting HVI-Continuity Platform Server...");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health endpoints
app.get("/api/health", (req, res) => {
    res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        message: "Main server is running"
    });
});

app.get("/api/health-enhanced", (req, res) => {
    res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        port: process.env.PORT || 5000,
        database: "checking",
        endpoints: [
            "/api/health",
            "/api/health-enhanced",
            "/api/assessments", 
            "/api/questions",
            "/api/dashboard/scores",
            "/api/users"
        ],
        memory: process.memoryUsage(),
        uptime: process.uptime()
    });
});

// Try to load routes with error handling
try {
    const assessmentRoutes = require("./routes/assessments");
    app.use("/api/assessments", assessmentRoutes);
    console.log("✅ Assessments routes loaded");
} catch (error) {
    console.log("❌ Assessments routes failed:", error.message);
    app.use("/api/assessments", (req, res) => {
        res.json({ error: "Assessments module not available", message: error.message });
    });
}

try {
    const questionRoutes = require("./routes/questions");
    app.use("/api/questions", questionRoutes);
    console.log("✅ Questions routes loaded");
} catch (error) {
    console.log("❌ Questions routes failed:", error.message);
    app.use("/api/questions", (req, res) => {
        res.json({ error: "Questions module not available", message: error.message });
    });
}

try {
    const dashboardRoutes = require("./routes/dashboard");
    app.use("/api/dashboard", dashboardRoutes);
    console.log("✅ Dashboard routes loaded");
} catch (error) {
    console.log("❌ Dashboard routes failed:", error.message);
    app.use("/api/dashboard", (req, res) => {
        res.json({ error: "Dashboard module not available", message: error.message });
    });
}

try {
    const userRoutes = require("./routes/users");
    app.use("/api/users", userRoutes);
    console.log("✅ Users routes loaded");
} catch (error) {
    console.log("❌ Users routes failed:", error.message);
    app.use("/api/users", (req, res) => {
        res.json({ error: "Users module not available", message: error.message });
    });
}

try {
    const authRoutes = require("./routes/auth");
    app.use("/api/auth", authRoutes);
    console.log("✅ Auth routes loaded");
} catch (error) {
    console.log("❌ Auth routes failed:", error.message);
    app.use("/api/auth", (req, res) => {
        res.json({ error: "Auth module not available", message: error.message });
    });
}

// MongoDB connection with timeout
setTimeout(() => {
    mongoose.connect("mongodb://localhost:27017/hvi-continuity", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.log("❌ MongoDB connection failed:", err.message));
}, 1000);

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ 
        error: "Endpoint not found",
        path: req.originalUrl
    });
});

// Error handler
app.use((error, req, res, next) => {
    console.error("Server error:", error);
    res.status(500).json({ 
        error: "Internal server error",
        message: error.message
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("✅ Server running on port " + PORT);
    console.log("📍 API available at: http://localhost:" + PORT + "/api");
    console.log("🔧 Health check: http://localhost:" + PORT + "/api/health");
    console.log("🎉 HVI-Continuity Platform backend is ready!");
});

module.exports = app;



