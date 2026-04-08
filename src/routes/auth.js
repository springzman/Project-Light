// Auth Routes
const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { createAccessToken, createRefreshToken, createClientToken } = require("../tokenManager/tokenCreation");
const { verifyToken } = require("../tokenManager/tokenVerify");
const error = require("../structs/error");
const functions = require("../structs/functions");

const app = express();

// POST /account/api/oauth/token
app.post("/account/api/oauth/token", async (req, res) => {
    const { grant_type, username, password, exchange_code, refresh_token } = req.body;

    try {
        if (grant_type === "password") {
            // Login with username/email and password
            if (!username || !password) {
                return res.status(400).json(error.invalidBody());
            }

            const user = await User.findOne({
                $or: [
                    { email: username },
                    { username: username },
                    { username_lower: username.toLowerCase() }
                ]
            });

            if (!user) {
                return res.status(401).json(error.invalidAccount());
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json(error.createError("Invalid password", 401, "errors.com.epicgames.common.oauth.invalid_grant"));
            }

            if (user.banned) {
                return res.status(403).json(error.createError("Your account has been banned", 403, "errors.com.epicgames.account.account_banned"));
            }

            const accessToken = createAccessToken(user.accountId, "fortnite", grant_type, "");
            const refreshToken = createRefreshToken(user.accountId, "fortnite", grant_type, "");

            return res.status(200).json({
                access_token: accessToken,
                expires_in: 28800,
                expires_at: functions.DateAddHours(new Date(), 8).toISOString(),
                token_type: "bearer",
                refresh_token: refreshToken,
                refresh_expires: 86400,
                refresh_expires_at: functions.DateAddHours(new Date(), 24).toISOString(),
                account_id: user.accountId,
                client_id: "fortnite",
                internal_client: true,
                client_service: "fortnite",
                displayName: user.username,
                app: "fortnite",
                in_app_id: user.accountId,
                device_id: ""
            });

        } else if (grant_type === "exchange_code") {
            // Login with exchange code
            if (!exchange_code) {
                return res.status(400).json(error.invalidBody());
            }

            const codeEntry = global.exchangeCodes.find(c => c.code === exchange_code);
            if (!codeEntry) {
                return res.status(401).json(error.createError("Invalid exchange code", 401, "errors.com.epicgames.common.oauth.invalid_exchange_code"));
            }

            // Remove the exchange code (one-time use)
            global.exchangeCodes = global.exchangeCodes.filter(c => c.code !== exchange_code);

            const user = await User.findOne({ accountId: codeEntry.accountId });
            if (!user) {
                return res.status(401).json(error.invalidAccount());
            }

            const accessToken = createAccessToken(user.accountId, "fortnite", grant_type, "");
            const refreshToken = createRefreshToken(user.accountId, "fortnite", grant_type, "");

            return res.status(200).json({
                access_token: accessToken,
                expires_in: 28800,
                expires_at: functions.DateAddHours(new Date(), 8).toISOString(),
                token_type: "bearer",
                refresh_token: refreshToken,
                refresh_expires: 86400,
                refresh_expires_at: functions.DateAddHours(new Date(), 24).toISOString(),
                account_id: user.accountId,
                client_id: "fortnite",
                internal_client: true,
                client_service: "fortnite",
                displayName: user.username,
                app: "fortnite",
                in_app_id: user.accountId,
                device_id: ""
            });

        } else if (grant_type === "refresh_token") {
            // Refresh token
            if (!refresh_token) {
                return res.status(400).json(error.invalidBody());
            }

            const tokenVerification = verifyToken(refresh_token);
            if (!tokenVerification.valid) {
                return res.status(401).json(error.invalidToken());
            }

            const user = await User.findOne({ accountId: tokenVerification.decoded.accountId });
            if (!user) {
                return res.status(401).json(error.invalidAccount());
            }

            const newAccessToken = createAccessToken(user.accountId, "fortnite", grant_type, "");
            const newRefreshToken = createRefreshToken(user.accountId, "fortnite", grant_type, "");

            return res.status(200).json({
                access_token: newAccessToken,
                expires_in: 28800,
                expires_at: functions.DateAddHours(new Date(), 8).toISOString(),
                token_type: "bearer",
                refresh_token: newRefreshToken,
                refresh_expires: 86400,
                refresh_expires_at: functions.DateAddHours(new Date(), 24).toISOString(),
                account_id: user.accountId,
                client_id: "fortnite",
                internal_client: true,
                client_service: "fortnite",
                displayName: user.username,
                app: "fortnite",
                in_app_id: user.accountId,
                device_id: ""
            });

        } else if (grant_type === "client_credentials") {
            // Client token
            const clientToken = createClientToken("fortnite", grant_type);

            return res.status(200).json({
                access_token: clientToken,
                expires_in: 14400,
                expires_at: functions.DateAddHours(new Date(), 4).toISOString(),
                token_type: "bearer",
                client_id: "fortnite",
                internal_client: true,
                client_service: "fortnite"
            });
        } else {
            return res.status(400).json(error.createError("Unsupported grant type", 400, "errors.com.epicgames.common.oauth.unsupported_grant_type"));
        }
    } catch (err) {
        console.error("OAuth token error:", err);
        return res.status(500).json(error.createError("Internal server error", 500, "errors.com.epicgames.common.server_error"));
    }
});

// POST /account/api/oauth/verify
app.post("/account/api/oauth/verify", async (req, res) => {
    const token = req.headers.authorization?.replace("bearer ", "");
    
    if (!token) {
        return res.status(401).json(error.invalidToken());
    }

    const tokenVerification = verifyToken(token);
    if (!tokenVerification.valid) {
        return res.status(401).json(error.invalidToken());
    }

    const user = await User.findOne({ accountId: tokenVerification.decoded.accountId });
    if (!user) {
        return res.status(401).json(error.invalidAccount());
    }

    res.status(200).json({
        access_token: token,
        expires_in: 28800,
        expires_at: functions.DateAddHours(new Date(), 8).toISOString(),
        token_type: "bearer",
        refresh_token: token,
        refresh_expires: 86400,
        refresh_expires_at: functions.DateAddHours(new Date(), 24).toISOString(),
        account_id: user.accountId,
        client_id: "fortnite",
        internal_client: true,
        client_service: "fortnite",
        displayName: user.username,
        app: "fortnite",
        in_app_id: user.accountId,
        device_id: ""
    });
});

// DELETE /account/api/oauth/sessions/kill
app.delete("/account/api/oauth/sessions/kill", (req, res) => {
    res.status(204).end();
});

// DELETE /account/api/oauth/sessions/kill/:token
app.delete("/account/api/oauth/sessions/kill/:token", (req, res) => {
    res.status(204).end();
});

// POST /account/api/oauth/exchange
app.post("/account/api/oauth/exchange", async (req, res) => {
    const token = req.headers.authorization?.replace("bearer ", "");
    
    if (!token) {
        return res.status(401).json(error.invalidToken());
    }

    const tokenVerification = verifyToken(token);
    if (!tokenVerification.valid) {
        return res.status(401).json(error.invalidToken());
    }

    const exchangeCode = functions.MakeID().replace(/-/ig, "");
    
    global.exchangeCodes.push({
        code: exchangeCode,
        accountId: tokenVerification.decoded.accountId,
        createdAt: new Date()
    });

    // Remove expired codes (5 minutes)
    global.exchangeCodes = global.exchangeCodes.filter(c => {
        return (new Date().getTime() - c.createdAt.getTime()) < 300000;
    });

    res.status(200).json({
        expiresInSeconds: 300,
        code: exchangeCode,
        creatingClientId: "fortnite"
    });
});

module.exports = app;
