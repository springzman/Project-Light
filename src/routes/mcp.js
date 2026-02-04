// MCP (Profile) Routes
const express = require("express");
const app = express();

// POST /fortnite/api/game/v2/profile/:accountId/client/:operation
app.post("/fortnite/api/game/v2/profile/:accountId/client/:operation", (req, res) => {
    res.status(200).send({
        status: "OK",
        code: 200
    });
});

module.exports = app;
