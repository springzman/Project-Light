// Require packages
const express = require("express");
require("dotenv").config();

const app = express();

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load routes
app.use(require("./src/routes/auth"));
app.use(require("./src/routes/account"));
app.use(require("./src/routes/mcp"));
app.use(require("./src/routes/lightswitch"));
app.use(require("./src/routes/cloudstorage"));
app.use(require("./src/routes/contentpages"));
app.use(require("./src/routes/version"));
app.use(require("./src/routes/keychain"));
app.use(require("./src/routes/datarouter"));

// Root endpoint
app.get("/", (req, res) => {
    res.status(200).send({
        status: "OK",
        message: "Fortnite Backend is running",
        build: "12.41"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(`Error occurred: ${err.message}`);
    res.status(500).send({
        status: "error",
        message: "Something went wrong!",
    });
});

app.use((req, res, next) => {
    res.on('finish', () => {
        if (res.statusCode >= 400) {
            console.error(`Issue with request: ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    });
    next();
});

// Start the server
const PORT = process.env.PORT || 3551;
app.listen(PORT, () => {
    console.log(`Fortnite Backend Server Started on port ${PORT}`);
    console.log(`Visit http://127.0.0.1:${PORT}/ to verify server is running`);
});
