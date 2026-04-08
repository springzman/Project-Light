# Complete Backend Code - All Files (Copy & Paste Ready)

This document contains EVERY file needed for the backend. Each file is complete and ready to copy.

---

## File: src/routes/api.js

```javascript
// Account Management API - Complete Implementation
const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");
const ProfileModel = require("../models/profiles");
const FriendModel = require("../models/friends");
const { MakeID } = require("../structs/functions");
const errorHandler = require("../structs/error");

const apiRouter = express.Router();

// Create new account endpoint
apiRouter.post("/api/v1/account/create", async (request, response) => {
    try {
        const { email, username, password } = request.body;

        // Validate input
        if (!email || !username || !password) {
            return response.status(400).json({ 
                success: false,
                message: "Email, username, and password are required" 
            });
        }

        // Check for existing account
        const existingAccount = await UserModel.findOne({
            $or: [
                { email: email },
                { username: username },
                { username_lower: username.toLowerCase() }
            ]
        });

        if (existingAccount) {
            return response.status(400).json({ 
                success: false,
                message: "Account with this email or username already exists" 
            });
        }

        // Hash password with bcrypt
        const passwordHash = await bcrypt.hash(password, 10);

        // Generate unique IDs
        const newAccountId = MakeID().replace(/-/ig, "");
        const matchmakerId = MakeID().replace(/-/ig, "");

        // Create user document
        const userDocument = new UserModel({
            created: new Date(),
            accountId: newAccountId,
            username: username,
            username_lower: username.toLowerCase(),
            email: email,
            password: passwordHash,
            matchmakingId: matchmakerId,
            vbucks: 0,
            banned: false
        });

        await userDocument.save();

        // Create profile document
        const profileDocument = new ProfileModel({
            accountId: newAccountId,
            profiles: {
                athena: { items: {}, stats: { attributes: {} }, rvn: 1 },
                common_core: { items: {}, stats: { attributes: {} }, rvn: 1 },
                creative: { items: {}, stats: { attributes: {} }, rvn: 1 }
            }
        });

        await profileDocument.save();

        // Create friends document
        const friendsDocument = new FriendModel({
            accountId: newAccountId,
            friends: [],
            blocked: []
        });

        await friendsDocument.save();

        response.status(201).json({
            success: true,
            message: "Account created successfully",
            data: {
                accountId: newAccountId,
                username: username,
                email: email
            }
        });

    } catch (error) {
        console.error("Account creation failed:", error);
        response.status(500).json({ 
            success: false,
            message: "Failed to create account", 
            error: error.message 
        });
    }
});

// Generate exchange code endpoint
apiRouter.post("/api/v1/account/exchange-code", async (request, response) => {
    try {
        const { username, password } = request.body;

        if (!username || !password) {
            return response.status(400).json({ 
                success: false,
                message: "Username and password are required" 
            });
        }

        // Find user
        const userDocument = await UserModel.findOne({
            $or: [
                { email: username },
                { username: username },
                { username_lower: username.toLowerCase() }
            ]
        });

        if (!userDocument) {
            return response.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, userDocument.password);
        if (!passwordMatch) {
            return response.status(401).json({ 
                success: false,
                message: "Invalid credentials" 
            });
        }

        // Check if banned
        if (userDocument.banned) {
            return response.status(403).json({ 
                success: false,
                message: "Account is banned" 
            });
        }

        // Generate exchange code
        const exchangeCodeValue = MakeID().replace(/-/ig, "");
        
        // Store in global array
        global.exchangeCodes = global.exchangeCodes || [];
        global.exchangeCodes.push({
            code: exchangeCodeValue,
            accountId: userDocument.accountId,
            createdAt: new Date()
        });

        // Clean expired codes (5 minutes)
        const fiveMinutesAgo = new Date().getTime() - (5 * 60 * 1000);
        global.exchangeCodes = global.exchangeCodes.filter(codeEntry => {
            return codeEntry.createdAt.getTime() > fiveMinutesAgo;
        });

        response.status(200).json({
            success: true,
            exchangeCode: exchangeCodeValue,
            expiresInSeconds: 300,
            message: "Use this code in the game launcher"
        });

    } catch (error) {
        console.error("Exchange code generation failed:", error);
        response.status(500).json({ 
            success: false,
            message: "Failed to generate exchange code", 
            error: error.message 
        });
    }
});

// Get gameserver info endpoint
apiRouter.get("/api/v1/gameserver/info", (request, response) => {
    const config = require("../../Config/config.json");
    
    response.status(200).json({
        success: true,
        gameserver: {
            ip: config.gameserver.ip,
            port: config.gameserver.port,
            status: "online"
        }
    });
});

module.exports = apiRouter;
```

---

## File: package.json

```json
{
  "name": "project-light-backend",
  "version": "3.0.0",
  "description": "Advanced Fortnite Backend for Season 12.41 with MongoDB, XMPP, Matchmaker, and Discord Bot",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
    "bot": "node discord/bot.js"
  },
  "keywords": ["fortnite", "backend", "emulator", "xmpp", "matchmaker", "discord"],
  "author": "Project Light",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "uuid": "^9.0.0",
    "ws": "^8.13.0",
    "xml-parser": "^1.2.1",
    "xmlbuilder": "^15.1.1",
    "express-rate-limit": "^6.7.0",
    "axios": "^1.4.0",
    "dotenv": "^16.0.3",
    "discord.js": "^14.11.0",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}
```

---

## File: .env.example

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/projectlight

# Server Configuration
PORT=3551
HOST=0.0.0.0

# JWT Secret (change this!)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Discord Bot
DISCORD_TOKEN=your-discord-bot-token-here
DISCORD_CLIENT_ID=your-discord-client-id-here
DISCORD_GUILD_ID=your-discord-server-id-here

# Gameserver
GAMESERVER_IP=127.0.0.1
GAMESERVER_PORT=7777
```

---

## File: Config/config.json

```json
{
  "gameserver": {
    "ip": "127.0.0.1",
    "port": 7777
  },
  "discord": {
    "moderators": ["YOUR_DISCORD_ID_HERE"]
  }
}
```

---

## File: index.js

```javascript
// Project Light Backend - Main Server v3.0
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");

// Import custom modules
const log = require("./src/structs/log");
const errorHandler = require("./src/structs/error");

// Import routes
const authRoutes = require("./src/routes/auth");
const accountRoutes = require("./src/routes/account");
const apiRoutes = require("./src/routes/api");
const mcpRoutes = require("./src/routes/mcp");
const cloudstorageRoutes = require("./src/routes/cloudstorage");
const contentpagesRoutes = require("./src/routes/contentpages");
const datarouterRoutes = require("./src/routes/datarouter");
const keychainRoutes = require("./src/routes/keychain");
const lightswitchRoutes = require("./src/routes/lightswitch");
const versionRoutes = require("./src/routes/version");
const settingsRoutes = require("./src/routes/settings");
const statsRoutes = require("./src/routes/stats");
const inventoryRoutes = require("./src/routes/inventory");
const friendsRoutes = require("./src/routes/friends");

// Import WebSocket services
const xmppServer = require("./src/xmpp/xmpp");
const matchmakerServer = require("./src/matchmaker/matchmaker");

// Initialize Express app
const mainApp = express();
const serverPort = process.env.PORT || 3551;

// Global variables
global.exchangeCodes = [];
global.xmppClients = new Map();

// Middleware
mainApp.use(cors());
mainApp.use(express.json());
mainApp.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 30 * 1000, // 30 seconds
    max: 55, // 55 requests per window
    message: { error: "Too many requests, please try again later" }
});
mainApp.use(limiter);

// Request logging
mainApp.use((req, res, next) => {
    log.backend(`${req.method} ${req.url}`);
    next();
});

// Mount routes
mainApp.use(authRoutes);
mainApp.use(accountRoutes);
mainApp.use(apiRoutes);
mainApp.use(mcpRoutes);
mainApp.use(cloudstorageRoutes);
mainApp.use(contentpagesRoutes);
mainApp.use(datarouterRoutes);
mainApp.use(keychainRoutes);
mainApp.use(lightswitchRoutes);
mainApp.use(versionRoutes);
mainApp.use(settingsRoutes);
mainApp.use(statsRoutes);
mainApp.use(inventoryRoutes);
mainApp.use(friendsRoutes);

// Root endpoint
mainApp.get("/", (req, res) => {
    res.status(200).json({
        name: "Project Light Backend",
        version: "3.0.0",
        status: "online",
        features: ["MongoDB", "XMPP", "Matchmaker", "Discord Bot", "Settings Storage", "Stats Tracking"]
    });
});

// Health check endpoint
mainApp.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected"
    });
});

// System stats endpoint
mainApp.get("/api/v1/system/stats", (req, res) => {
    res.status(200).json({
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        connections: {
            xmpp: global.xmppClients.size,
            mongodb: mongoose.connection.readyState === 1
        }
    });
});

// Create storage directories
const storageDirs = [
    "./storage/settings",
    "./storage/cloud/system",
    "./storage/cloud/users",
    "./storage/analytics",
    "./storage/backups",
    "./storage/logs"
];

storageDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        log.backend(`Created directory: ${dir}`);
    }
});

// 404 handler
mainApp.use((req, res) => {
    res.status(404).json(errorHandler.createError("Endpoint not found", 404, "errors.com.epicgames.common.not_found"));
});

// Error handler
mainApp.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json(errorHandler.createError("Internal server error", 500, "errors.com.epicgames.common.server_error"));
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/projectlight", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    log.backend("Connected to MongoDB");
    
    // Start HTTP server
    const httpServer = mainApp.listen(serverPort, () => {
        log.backend(`HTTP Server listening on port ${serverPort}`);
        log.backend("Project Light Backend v3.0 - Ready!");
    });

    // Initialize XMPP WebSocket server
    xmppServer.initialize(httpServer);
    log.backend("XMPP Server initialized");

    // Initialize Matchmaker WebSocket server
    matchmakerServer.initialize(httpServer);
    log.backend("Matchmaker Server initialized");
})
.catch(err => {
    log.error("MongoDB connection failed:", err);
    process.exit(1);
});

// Graceful shutdown
process.on("SIGINT", () => {
    log.backend("Shutting down gracefully...");
    mongoose.connection.close();
    process.exit(0);
});

// Uncaught exception handler
process.on("uncaughtException", (err) => {
    log.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
    log.error("Unhandled rejection:", err);
});
```

---

## PART 1 COMPLETE

This document continues with all remaining files. Would you like me to continue with:
- All other route files
- All model files  
- All struct/utility files
- Discord bot files
- XMPP and Matchmaker files
- Complete documentation

Let me know and I'll provide the rest!
