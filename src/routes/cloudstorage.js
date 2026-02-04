// CloudStorage Routes
const express = require("express");
const app = express();

// GET /fortnite/api/cloudstorage/system
app.get("/fortnite/api/cloudstorage/system", (req, res) => {
    res.status(200).send({
        status: "OK",
        code: 200
    });
});

// GET /fortnite/api/cloudstorage/user/:accountId
app.get("/fortnite/api/cloudstorage/user/:accountId", (req, res) => {
    res.status(200).send({
        status: "OK",
        code: 200
    });
});

// PUT /fortnite/api/cloudstorage/user/:accountId/:fileName
app.put("/fortnite/api/cloudstorage/user/:accountId/:fileName", (req, res) => {
    res.status(200).send({
        status: "OK",
        code: 200
    });
});

module.exports = app;
