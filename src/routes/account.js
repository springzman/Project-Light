// Account Routes
const express = require("express");
const User = require("../models/user");
const authenticateToken = require("../structs/middleware");
const error = require("../structs/error");

const app = express();

// POST /fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId
app.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId", authenticateToken, (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("true");
});

// GET /account/api/public/account/:accountId/externalAuths
app.get("/account/api/public/account/:accountId/externalAuths", authenticateToken, (req, res) => {
    res.status(200).send([]);
});

// GET /fortnite/api/game/v2/enabled_features
app.get("/fortnite/api/game/v2/enabled_features", authenticateToken, (req, res) => {
    res.status(200).send([]);
});

// GET /content-controls/:accountId
app.get("/content-controls/:accountId", (req, res) => {
    res.status(200).send([]);
});

// GET /account/api/public/account
app.get("/account/api/public/account", authenticateToken, async (req, res) => {
    const accountIds = req.query.accountId;
    
    if (!accountIds) {
        return res.status(400).json(error.invalidBody());
    }

    const ids = Array.isArray(accountIds) ? accountIds : [accountIds];
    const users = await User.find({ accountId: { $in: ids } }).lean();

    const accounts = users.map(user => ({
        id: user.accountId,
        displayName: user.username,
        externalAuths: {}
    }));

    res.status(200).json(accounts);
});

// GET /account/api/public/account/:accountId
app.get("/account/api/public/account/:accountId", authenticateToken, async (req, res) => {
    const { accountId } = req.params;
    
    const user = await User.findOne({ accountId }).lean();
    
    if (!user) {
        return res.status(404).json(error.invalidAccount());
    }

    res.status(200).json({
        id: user.accountId,
        displayName: user.username,
        name: user.username,
        email: user.email,
        failedLoginAttempts: 0,
        lastLogin: new Date().toISOString(),
        numberOfDisplayNameChanges: 0,
        ageGroup: "UNKNOWN",
        headless: false,
        country: "US",
        lastName: "User",
        links: {},
        preferredLanguage: "en",
        canUpdateDisplayName: false,
        tfaEnabled: false,
        emailVerified: true,
        minorVerified: false,
        minorExpected: false,
        minorStatus: "UNKNOWN"
    });
});

// POST /api/v1/user/setting
app.post("/api/v1/user/setting", authenticateToken, (req, res) => {
    res.status(204).end();
});

// GET /socialban/api/public/v1/:accountId
app.get("/socialban/api/public/v1/:accountId", (req, res) => {
    res.status(200).send({
        bans: [],
        warnings: []
    });
});

// GET /presence/api/v1/_/:accountId/settings/subscriptions
app.get("/presence/api/v1/_/:accountId/settings/subscriptions", authenticateToken, (req, res) => {
    res.status(200).send({});
});

// GET /fortnite/api/game/v2/privacy/account/:accountId
app.get("/fortnite/api/game/v2/privacy/account/:accountId", authenticateToken, (req, res) => {
    res.status(200).json({
        accountId: req.params.accountId,
        optOutOfPublicLeaderboards: false
    });
});

// GET /account/api/epicdomains/ssodomains
app.get("/account/api/epicdomains/ssodomains", (req, res) => {
    res.status(200).json([
        "unrealengine.com",
        "unrealtournament.com",
        "fortnite.com",
        "epicgames.com"
    ]);
});

module.exports = app;
