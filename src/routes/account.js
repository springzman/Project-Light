// Account Routes
const express = require("express");
const app = express();

// POST /fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId
app.post("/fortnite/api/game/v2/tryPlayOnPlatform/account/:accountId", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.status(200).send("true");
});

// GET /account/api/public/account/:accountId/externalAuths
app.get("/account/api/public/account/:accountId/externalAuths", (req, res) => {
    res.status(200).send([]);
});

// GET /fortnite/api/game/v2/enabled_features
app.get("/fortnite/api/game/v2/enabled_features", (req, res) => {
    res.status(200).send([]);
});

// GET /content-controls/:accountId
app.get("/content-controls/:accountId", (req, res) => {
    res.status(200).send([]);
});

// GET /account/api/public/account
app.get("/account/api/public/account", (req, res) => {
    res.status(200).send({
        id: "fortnite",
        displayName: "fortnite",
        externalAuth: {}
    });
});

// GET /account/api/public/account/:accountId
app.get("/account/api/public/account/:accountId", (req, res) => {
    res.status(200).send({
        id: "fortnite",
        displayName: "fortnite",
        name: "fortnite",
        email: "fortnite@fortnite.dev",
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
        tfaEnabled: true,
        emailVerified: true,
        minorVerified: true,
        minorExpected: true,
        minorStatus: "UNKNOWN"
    });
});

// POST /api/v1/user/setting
app.post("/api/v1/user/setting", (req, res) => {
    res.status(200).send({
        status: "OK",
        code: 200
    });
});

// GET /socialban/api/public/v1/:accountId
app.get("/socialban/api/public/v1/:accountId", (req, res) => {
    res.status(200).send([]);
});

// GET /presence/api/v1/_/:accountId/settings/subscriptions
app.get("/presence/api/v1/_/:accountId/settings/subscriptions", (req, res) => {
    res.status(200).send([]);
});

// GET /fortnite/api/game/v2/privacy/account/:accountId
app.get("/fortnite/api/game/v2/privacy/account/:accountId", (req, res) => {
    res.status(200).send([]);
});

module.exports = app;
