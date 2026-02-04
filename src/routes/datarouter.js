// Datarouter Routes
const express = require("express");
const app = express();

// POST /datarouter/api/v1/public/data
app.post("/datarouter/api/v1/public/data", (req, res) => {
    res.status(200).send({
        status: "OK",
        code: 200
    });
});

module.exports = app;
