const http = require("http");

console.log("Comprehensive Health Check");
console.log("=".repeat(40));

const endpoints = [
    { path: "/api/health", name: "Health" },
    { path: "/api/health-enhanced", name: "Enhanced Health" },
    { path: "/api/assessments", name: "Assessments" },
    { path: "/api/questions", name: "Questions" },
    { path: "/api/dashboard/scores", name: "Dashboard" },
    { path: "/api/users", name: "Users" }
];

let operational = 0;

endpoints.forEach((endpoint, index) => {
    setTimeout(() => {
        const req = http.request({
            hostname: "localhost",
            port: 5000,
            path: endpoint.path,
            method: "GET",
            timeout: 10000
        }, (res) => {
            if (res.statusCode === 200) {
                console.log("✅ " + endpoint.name + " - OPERATIONAL");
                operational++;
            } else {
                console.log("❌ " + endpoint.name + " - Status: " + res.statusCode);
            }
            
            // Final summary
            if (index === endpoints.length - 1) {
                setTimeout(() => {
                    console.log("\n" + "=".repeat(40));
                    console.log("📊 FINAL STATUS:");
                    console.log("Operational: " + operational + "/" + endpoints.length);
                    console.log("Success Rate: " + Math.round((operational / endpoints.length) * 100) + "%");
                    
                    if (operational === endpoints.length) {
                        console.log("\n🎉 BACKEND IS FULLY OPERATIONAL!");
                        console.log("🚀 Ready for authentication system!");
                    }
                }, 1000);
            }
        });

        req.on("error", () => {
            console.log("❌ " + endpoint.name + " - UNREACHABLE");
        });

        req.on("timeout", () => {
            console.log("⏰ " + endpoint.name + " - TIMEOUT");
            req.destroy();
        });

        req.end();
    }, index * 1000);
});
