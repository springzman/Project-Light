// API Routes for account management
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Profiles = require("../models/profiles");
const Friends = require("../models/friends");
const functions = require("../structs/functions");
const error = require("../structs/error");

const app = express();

// POST /api/v1/account/create
app.post("/api/v1/account/create", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!email || !username || !password) {
            return res.status(400).json({ 
                error: "Missing required fields: email, username, password" 
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { username: username },
                { username_lower: username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ 
                error: "An account with this email or username already exists" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const accountId = functions.MakeID().replace(/-/ig, "");
        const matchmakingId = functions.MakeID().replace(/-/ig, "");

        const newUser = new User({
            created: new Date(),
            accountId: accountId,
            username: username,
            username_lower: username.toLowerCase(),
            email: email,
            password: hashedPassword,
            matchmakingId: matchmakingId,
            vbucks: 0,
            banned: false
        });

        await newUser.save();

        // Create default profiles
        const newProfile = new Profiles({
            accountId: accountId,
            profiles: {
                athena: {},
                common_core: {},
                creative: {}
            }
        });

        await newProfile.save();

        // Create friends list
        const newFriends = new Friends({
            accountId: accountId,
            friends: [],
            blocked: []
        });

        await newFriends.save();

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            accountId: accountId,
            username: username,
            email: email
        });

    } catch (err) {
        console.error("Account creation error:", err);
        res.status(500).json({ 
            error: "Failed to create account", 
            details: err.message 
        });
    }
});

// POST /api/v1/account/exchange-code
app.post("/api/v1/account/exchange-code", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                error: "Missing required fields: username, password" 
            });
        }

        const user = await User.findOne({
            $or: [
                { email: username },
                { username: username },
                { username_lower: username.toLowerCase() }
            ]
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        if (user.banned) {
            return res.status(403).json({ error: "Account is banned" });
        }

        const exchangeCode = functions.MakeID().replace(/-/ig, "");
        
        global.exchangeCodes.push({
            code: exchangeCode,
            accountId: user.accountId,
            createdAt: new Date()
        });

        // Remove expired codes (5 minutes)
        global.exchangeCodes = global.exchangeCodes.filter(c => {
            return (new Date().getTime() - c.createdAt.getTime()) < 300000;
        });

        res.status(200).json({
            success: true,
            exchangeCode: exchangeCode,
            expiresInSeconds: 300,
            message: "Use this code to login in the game"
        });

    } catch (err) {
        console.error("Exchange code generation error:", err);
        res.status(500).json({ 
            error: "Failed to generate exchange code", 
            details: err.message 
        });
    }
});

module.exports = app;
