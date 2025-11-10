const http = require("http");

const endpoints = [
    "/api/health",
    "/api/health-enhanced", 
    "/api/assessments",
    "/api/questions",
    "/api/dashboard/scores",
    "/api/users",
    "/api/users/profile/123"
];

let passed = 0;
let failed = 0;

function testEndpoint(endpoint) {
    return new Promise((resolve) => {
        const req = http.request({
            hostname: "localhost",
            port: 5000,
            path: endpoint,
            method: "GET",
            timeout: 5000
        }, (res) => {
            if (res.statusCode === 200) {
                console.log("✅ " + endpoint + " - Working");
                passed++;
            } else {
                console.log("❌ " + endpoint + " - Status: " + res.statusCode);
                failed++;
            }
            resolve();
        });

        req.on("error", () => {
            console.log("❌ " + endpoint + " - Failed");
            failed++;
            resolve();
        });

        req.on("timeout", () => {
            console.log("⏰ " + endpoint + " - Timeout");
            failed++;
            req.destroy();
            resolve();
        });

        req.end();
    });
}

async function runTests() {
    console.log("Testing endpoints on minimal server...");
    
    for (const endpoint of endpoints) {
        await testEndpoint(endpoint);
    }
    
    console.log("\n📋 Results:");
    console.log("✅ Passed: " + passed);
    console.log("❌ Failed: " + failed);
    console.log("📊 Success: " + Math.round((passed / endpoints.length) * 100) + "%");
    
    if (passed === endpoints.length) {
        console.log("\n🎉 All endpoints are working!");
    }
}

runTests();
