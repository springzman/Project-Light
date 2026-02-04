// ContentPages Routes
const express = require("express");
const app = express();

// GET /content/api/pages/fortnite-game
app.get("/content/api/pages/fortnite-game", (req, res) => {
    res.status(200).send({
        status: "OK",
        code: 200
    });
});

module.exports = app;
