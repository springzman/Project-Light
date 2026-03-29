// Data Router System - Custom Implementation  
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Analytics data storage
const analyticsPath = path.join(__dirname, "../../storage/analytics");
if (!fs.existsSync(analyticsPath)) {
    fs.mkdirSync(analyticsPath, { recursive: true });
}

// Process analytics data from client
router.post("/datarouter/api/v1/public/data", (req, res) => {
    try {
        const analyticsData = req.body;
        const timestamp = Date.now();
        
        // Log analytics to file for debugging/analysis
        if (analyticsData && analyticsData.Events && analyticsData.Events.length > 0) {
            const logFilename = `analytics-${new Date().toISOString().split('T')[0]}.log`;
            const logPath = path.join(analyticsPath, logFilename);
            
            const logEntry = {
                timestamp: new Date().toISOString(),
                eventCount: analyticsData.Events.length,
                events: analyticsData.Events.map(evt => ({
                    eventName: evt.EventName,
                    timestamp: evt.DateOffset
                }))
            };
            
            fs.appendFileSync(logPath, JSON.stringify(logEntry) + '\n');
        }
        
        res.status(204).end();
    } catch (err) {
        console.error("Data router error:", err);
        res.status(204).end(); // Still return success to not break client
    }
});

module.exports = router;
