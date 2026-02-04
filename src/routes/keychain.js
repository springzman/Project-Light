// Keychain Routes
const express = require("express");
const app = express();
const keychain = require("../responses/keychain.json");

// GET /fortnite/api/storefront/v2/keychain
app.get("/fortnite/api/storefront/v2/keychain", (req, res) => {
    res.status(200).send(keychain);
});

module.exports = app;
