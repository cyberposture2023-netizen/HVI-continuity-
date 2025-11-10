const http = require("http");

console.log("Testing minimal server...");

const req = http.request({
    hostname: "localhost",
    port: 5000,
    path: "/api/health",
    method: "GET",
    timeout: 10000
}, (res) => {
    let data = "";
    res.on("data", chunk => data += chunk);
    res.on("end", () => {
        console.log("✅ Server responded!");
        console.log("Status:", res.statusCode);
        try {
            const health = JSON.parse(data);
            console.log("Response:", health);
        } catch (e) {
            console.log("Raw response:", data);
        }
    });
});

req.on("error", (error) => {
    console.log("❌ Server error:", error.message);
});

req.on("timeout", () => {
    console.log("⏰ Server timeout");
    req.destroy();
});

req.end();
