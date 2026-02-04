// Auth Routes
const express = require("express");
const app = express();

// POST /account/api/oauth/token
app.post("/account/api/oauth/token", (req, res) => {
    res.status(200).send({
        access_token: "eg1~fortnite",
        expires_in: 28800,
        expires_at: "9999-12-02T01:12:01.100Z",
        token_type: "bearer",
        refresh_token: "eg1~fortnite",
        refresh_expires: 86400,
        refresh_expires_at: "9999-12-02T01:12:01.100Z",
        account_id: "fornite",
        client_id: "fornite",
        internal_client: true,
        client_service: "fortnite",
        displayName: "fornite",
        app: "fortnite",
        in_app_id: "fornite",
        device_id: "fornite"
    });
});

// POST /account/api/oauth/verify
app.post("/account/api/oauth/verify", (req, res) => {
    res.status(200).send({
        access_token: "eg1~fortnite",
        expires_in: 28800,
        expires_at: "9999-12-02T01:12:01.100Z",
        token_type: "bearer",
        refresh_token: "eg1~fortnite",
        refresh_expires: 86400,
        refresh_expires_at: "9999-12-02T01:12:01.100Z",
        account_id: "fornite",
        client_id: "fornite",
        internal_client: true,
        client_service: "fortnite",
        displayName: "fornite",
        app: "fortnite",
        in_app_id: "fornite",
        device_id: "fornite"
    });
});

// DELETE /account/api/oauth/sessions/kill
app.delete("/account/api/oauth/sessions/kill", (req, res) => {
    res.status(200).send({
        status: "OK",
        code: 200
    });
});

// DELETE /account/api/oauth/sessions/kill/:token
app.delete("/account/api/oauth/sessions/kill/:token", (req, res) => {
    res.status(200).send({
        status: "OK",
        code: 200
    });
});

module.exports = app;
