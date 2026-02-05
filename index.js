// Fortnite Backend v3.0 - Ultimate Edition
// The Most Advanced Fortnite Backend with Settings Storage & Enhanced Features
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const log = require("./src/structs/log");
const functions = require("./src/structs/functions");

const app = express();
const server = http.createServer(app);

// Load configuration
const configPath = path.join(__dirname, "Config", "config.json");
const config = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath, "utf8")) : {};

// Generate JWT secret if not provided
global.JWT_SECRET = process.env.JWT_SECRET || functions.MakeID();
global.exchangeCodes = [];
global.config = config;

// Ensure storage directories exist
const storageDirs = [
    path.join(__dirname, "storage", "settings"),
    path.join(__dirname, "storage", "backups"),
    path.join(__dirname, "storage", "logs")
];

storageDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log.info(`Created storage directory: ${dir}`);
    }
});

// Middleware for parsing JSON and URL-encoded data
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

// Advanced Rate limiting with multiple tiers
const createRateLimiter = (windowMs, max, message) => rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false
});

// Apply different rate limits based on routes
app.use('/api/v1/settings', createRateLimiter(60 * 1000, 30, "Too many settings requests"));
app.use('/api/v1/stats', createRateLimiter(60 * 1000, 60, "Too many stats requests"));
app.use('/api/v1/inventory', createRateLimiter(60 * 1000, 50, "Too many inventory requests"));
app.use('/api/v1/friends', createRateLimiter(60 * 1000, 40, "Too many friend requests"));
app.use('/account/api/oauth', createRateLimiter(5 * 60 * 1000, 10, "Too many authentication attempts"));

// General rate limit for all other routes
app.use(createRateLimiter(30 * 1000, 55, "Too many requests, please try again later"));

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        if (process.env.LOG_REQUESTS === 'true') {
            log.debug(`${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
        }
    });
    next();
});

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || config.mongodb?.database || "mongodb://localhost:27017/fortnite";
mongoose.set('strictQuery', true);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    log.backend("Successfully connected to MongoDB!");
    log.info(`Database: ${mongoose.connection.name}`);
}).catch(err => {
    log.error("MongoDB failed to connect. Please make sure MongoDB is installed and running.");
    log.error(`Error: ${err.message}`);
    process.exit(1);
});

mongoose.connection.on("error", err => {
    log.error(`MongoDB connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
    log.warning("MongoDB disconnected. Attempting to reconnect...");
});

mongoose.connection.on("reconnected", () => {
    log.info("MongoDB reconnected successfully");
});

// Load all routes
log.info("Loading API routes...");

// Core routes
app.use(require("./src/routes/api"));
app.use(require("./src/routes/auth"));
app.use(require("./src/routes/account"));
app.use(require("./src/routes/mcp"));
app.use(require("./src/routes/lightswitch"));
app.use(require("./src/routes/cloudstorage"));
app.use(require("./src/routes/contentpages"));
app.use(require("./src/routes/version"));
app.use(require("./src/routes/keychain"));
app.use(require("./src/routes/datarouter"));

// Advanced API routes
try {
    app.use(require("./src/routes/settings"));
    log.info("✓ Settings API loaded");
} catch (e) {
    log.warning("Settings API not loaded");
}

try {
    app.use(require("./src/routes/stats"));
    log.info("✓ Stats API loaded");
} catch (e) {
    log.warning("Stats API not loaded");
}

try {
    app.use(require("./src/routes/inventory"));
    log.info("✓ Inventory API loaded");
} catch (e) {
    log.warning("Inventory API not loaded");
}

try {
    app.use(require("./src/routes/friends"));
    log.info("✓ Friends API loaded");
} catch (e) {
    log.warning("Friends API not loaded");
}

// Root endpoint with comprehensive information
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        name: "Fortnite Backend v3.0 - Ultimate Edition",
        version: "3.0.0",
        build: "12.41",
        description: "The most advanced Fortnite backend with complete features",
        features: [
            "MongoDB Database",
            "XMPP Real-time Messaging",
            "Advanced Matchmaker",
            "JWT Authentication",
            "Discord Bot Integration",
            "User Settings Storage",
            "Stats Tracking",
            "Leaderboards",
            "Inventory Management",
            "Friends System",
            "Advanced API"
        ],
        uptime: process.uptime(),
        memory: {
            used: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            total: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`
        },
        clients: {
            connected: global.Clients ? global.Clients.length : 0
        },
        gameserver: {
            ip: config.gameServerIP || "127.0.0.1:7777",
            port: config.gameServerPort || 7777
        },
        database: {
            status: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
            name: mongoose.connection.name
        }
    });
});

// Health check endpoint with detailed metrics
app.get("/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusMap = {
        0: "disconnected",
        1: "connected",
        2: "connecting",
        3: "disconnecting"
    };

    res.status(200).json({
        status: dbStatus === 1 ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        mongodb: {
            status: dbStatusMap[dbStatus],
            database: mongoose.connection.name,
            host: mongoose.connection.host
        },
        uptime: {
            seconds: Math.floor(process.uptime()),
            formatted: `${Math.floor(process.uptime() / 3600)}h ${Math.floor((process.uptime() % 3600) / 60)}m ${Math.floor(process.uptime() % 60)}s`
        },
        memory: {
            heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`,
            heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)}MB`,
            rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`
        },
        clients: {
            xmpp: global.Clients ? global.Clients.length : 0,
            total: global.Clients ? global.Clients.length : 0
        },
        gameserver: {
            configured: config.gameServerIP ? true : false,
            ip: config.gameServerIP || "not configured",
            port: config.gameServerPort || 0
        }
    });
});

// Advanced API info endpoint
app.get("/api/v1/info", (req, res) => {
    res.status(200).json({
        success: true,
        api: {
            version: "1.0",
            name: "Fortnite Backend API",
            features: {
                authentication: true,
                settings: true,
                stats: true,
                inventory: true,
                friends: true,
                leaderboard: true,
                achievements: true
            }
        },
        endpoints: {
            settings: "/api/v1/settings",
            stats: "/api/v1/stats",
            inventory: "/api/v1/inventory",
            friends: "/api/v1/friends",
            leaderboard: "/api/v1/leaderboard/:mode",
            gameserver: "/api/v1/gameserver"
        },
        documentation: "See README.md for full API documentation"
    });
});

// Gameserver info endpoint
app.get("/api/v1/gameserver", (req, res) => {
    res.status(200).json({
        success: true,
        gameserver: {
            ip: config.gameServerIP || "127.0.0.1:7777",
            port: config.gameServerPort || 7777,
            fullAddress: `${config.gameServerIP || "127.0.0.1:7777"}`,
            status: "configured"
        }
    });
});

// System stats endpoint (admin)
app.get("/api/v1/system/stats", (req, res) => {
    const stats = {
        server: {
            uptime: process.uptime(),
            platform: process.platform,
            nodeVersion: process.version,
            cpuUsage: process.cpuUsage(),
            memoryUsage: process.memoryUsage()
        },
        database: {
            status: mongoose.connection.readyState,
            collections: mongoose.connection.collections ? Object.keys(mongoose.connection.collections).length : 0
        },
        clients: {
            connected: global.Clients ? global.Clients.length : 0
        }
    };

    res.status(200).json({
        success: true,
        stats
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    log.error(`Error occurred: ${err.message}`);
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.name || "Internal Server Error",
        message: err.message || "An unexpected error occurred",
        status: err.status || 500
    });
});

// 404 handler
app.use((req, res) => {
    log.warning(`404: ${req.method} ${req.url}`);
    res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.url}`,
        status: 404
    });
});

// Start the HTTP server
const PORT = process.env.PORT || config.port || 3551;
server.listen(PORT, () => {
    console.log("");
    log.backend("╔════════════════════════════════════════════════════════════╗");
    log.backend("║                                                            ║");
    log.backend("║       Fortnite Backend v3.0 - Ultimate Edition            ║");
    log.backend("║                                                            ║");
    log.backend("╚════════════════════════════════════════════════════════════╝");
    console.log("");
    log.backend(`✓ Backend Server started on port ${PORT}`);
    log.backend(`✓ Visit http://127.0.0.1:${PORT}/ to verify`);
    log.backend(`✓ Gameserver: ${config.gameServerIP || "127.0.0.1"}:${config.gameServerPort || 7777}`);
    log.backend(`✓ Database: ${mongoose.connection.name}`);
    console.log("");
    log.info("All systems operational! 🚀");
    console.log("");
});

// Initialize XMPP and Matchmaker servers
const setupXMPP = require("./src/xmpp/xmpp");
const setupMatchmaker = require("./src/matchmaker/matchmaker");

setupXMPP(server);
setupMatchmaker(server);

// Start Discord bot if enabled
if (config.discord && config.discord.enabled) {
    try {
        log.info("Discord bot is enabled, starting...");
        require("./discord/bot.js");
    } catch (error) {
        log.error(`Failed to start Discord bot: ${error.message}`);
    }
}

// Auto-backup system (runs every hour)
if (process.env.AUTO_BACKUP === 'true') {
    const backupInterval = 60 * 60 * 1000; // 1 hour
    setInterval(() => {
        log.info("Running automated backup...");
        // Add backup logic here
    }, backupInterval);
}

// Handle graceful shutdown
const gracefulShutdown = (signal) => {
    log.info(`${signal} received, shutting down gracefully...`);
    
    server.close(() => {
        log.info("HTTP server closed");
        
        mongoose.connection.close(false, () => {
            log.info("MongoDB connection closed");
            log.info("Server shutdown complete");
            process.exit(0);
        });
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
        log.error("Forced shutdown after timeout");
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
    log.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    log.error(`Unhandled Rejection at: ${promise}`);
    log.error(`Reason: ${reason}`);
});

// Export for testing
module.exports = { app, server };
