// Require packages
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const log = require("./src/structs/log");
const functions = require("./src/structs/functions");

const app = express();
const server = http.createServer(app);

// Generate JWT secret if not provided
global.JWT_SECRET = process.env.JWT_SECRET || functions.MakeID();
global.exchangeCodes = [];

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(rateLimit({ 
    windowMs: 0.5 * 60 * 1000, 
    max: 55,
    message: { error: "Too many requests, please try again later." }
}));

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/fortnite";
mongoose.set('strictQuery', true);

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    log.backend("Successfully connected to MongoDB!");
}).catch(err => {
    log.error("MongoDB failed to connect. Please make sure MongoDB is installed and running.");
    log.error(`Error: ${err.message}`);
    process.exit(1);
});

mongoose.connection.on("error", err => {
    log.error(`MongoDB connection error: ${err.message}`);
});

// Load routes
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

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Fortnite Backend v2.0 - Advanced Edition",
        build: "12.41",
        features: ["MongoDB", "XMPP", "Matchmaker", "JWT Auth"],
        uptime: process.uptime(),
        clients: global.Clients ? global.Clients.length : 0
    });
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy",
        mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        clients: global.Clients ? global.Clients.length : 0
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    log.error(`Error occurred: ${err.message}`);
    console.error(err.stack);
    res.status(500).json({
        error: "Internal Server Error",
        message: err.message
    });
});

// 404 handler
app.use((req, res) => {
    log.warning(`404: ${req.method} ${req.url}`);
    res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.url}`
    });
});

// Start the HTTP server
const PORT = process.env.PORT || 3551;
server.listen(PORT, () => {
    log.backend(`Backend Server started on port ${PORT}`);
    log.backend(`Visit http://127.0.0.1:${PORT}/ to verify server is running`);
    console.log("");
});

// Initialize XMPP and Matchmaker servers on the same HTTP server
const setupXMPP = require("./src/xmpp/xmpp");
const setupMatchmaker = require("./src/matchmaker/matchmaker");

// Setup XMPP and Matchmaker on the same server
setupXMPP(server);
setupMatchmaker(server);

// Handle graceful shutdown
process.on('SIGINT', () => {
    log.info("Shutting down gracefully...");
    server.close(() => {
        mongoose.connection.close(false, () => {
            log.info("Server closed");
            process.exit(0);
        });
    });
});

process.on('uncaughtException', (err) => {
    log.error(`Uncaught Exception: ${err.message}`);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    log.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});
