// Cloud Storage System - Custom Implementation
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Storage paths
const systemStoragePath = path.join(__dirname, "../../storage/cloud/system");
const userStoragePath = path.join(__dirname, "../../storage/cloud/users");

// Ensure directories exist
[systemStoragePath, userStoragePath].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// System cloud storage - returns list of system files
router.get("/fortnite/api/cloudstorage/system", (req, res) => {
    try {
        const systemFiles = [];
        const files = fs.existsSync(systemStoragePath) ? fs.readdirSync(systemStoragePath) : [];
        
        files.forEach(filename => {
            const filepath = path.join(systemStoragePath, filename);
            const fileStats = fs.statSync(filepath);
            const fileHash = require("crypto").createHash("sha1").update(fs.readFileSync(filepath)).digest("hex");
            
            systemFiles.push({
                uniqueFilename: filename,
                filename: filename,
                hash: fileHash,
                hash256: require("crypto").createHash("sha256").update(fs.readFileSync(filepath)).digest("hex"),
                length: fileStats.size,
                contentType: "application/octet-stream",
                uploaded: fileStats.mtime.toISOString(),
                storageType: "S3",
                doNotCache: false
            });
        });
        
        res.status(200).json(systemFiles);
    } catch (err) {
        console.error("System storage error:", err);
        res.status(200).json([]);
    }
});

// User cloud storage - returns list of user files
router.get("/fortnite/api/cloudstorage/user/:accountId", (req, res) => {
    const userId = req.params.accountId;
    const userDir = path.join(userStoragePath, userId);
    
    try {
        const userFiles = [];
        if (fs.existsSync(userDir)) {
            const files = fs.readdirSync(userDir);
            
            files.forEach(filename => {
                const filepath = path.join(userDir, filename);
                const fileStats = fs.statSync(filepath);
                const fileHash = require("crypto").createHash("sha1").update(fs.readFileSync(filepath)).digest("hex");
                
                userFiles.push({
                    uniqueFilename: filename,
                    filename: filename,
                    hash: fileHash,
                    hash256: require("crypto").createHash("sha256").update(fs.readFileSync(filepath)).digest("hex"),
                    length: fileStats.size,
                    contentType: "application/octet-stream",
                    uploaded: fileStats.mtime.toISOString(),
                    storageType: "S3",
                    storageIds: {},
                    accountId: userId,
                    doNotCache: false
                });
            });
        }
        
        res.status(200).json(userFiles);
    } catch (err) {
        console.error("User storage error:", err);
        res.status(200).json([]);
    }
});

// Upload user file to cloud storage
router.put("/fortnite/api/cloudstorage/user/:accountId/:fileName", (req, res) => {
    const userId = req.params.accountId;
    const filename = req.params.fileName;
    const userDir = path.join(userStoragePath, userId);
    
    try {
        if (!fs.existsSync(userDir)) {
            fs.mkdirSync(userDir, { recursive: true });
        }
        
        const filepath = path.join(userDir, filename);
        const fileContent = req.body;
        
        fs.writeFileSync(filepath, JSON.stringify(fileContent));
        
        res.status(204).end();
    } catch (err) {
        console.error("File upload error:", err);
        res.status(500).json({ error: "Failed to upload file" });
    }
});

// Get specific system file
router.get("/fortnite/api/cloudstorage/system/:fileName", (req, res) => {
    const filename = req.params.fileName;
    const filepath = path.join(systemStoragePath, filename);
    
    try {
        if (fs.existsSync(filepath)) {
            const fileContent = fs.readFileSync(filepath);
            res.setHeader("Content-Type", "application/octet-stream");
            res.status(200).send(fileContent);
        } else {
            res.status(404).json({ error: "File not found" });
        }
    } catch (err) {
        console.error("File retrieval error:", err);
        res.status(404).json({ error: "File not found" });
    }
});

// Get specific user file
router.get("/fortnite/api/cloudstorage/user/:accountId/:fileName", (req, res) => {
    const userId = req.params.accountId;
    const filename = req.params.fileName;
    const filepath = path.join(userStoragePath, userId, filename);
    
    try {
        if (fs.existsSync(filepath)) {
            const fileContent = fs.readFileSync(filepath);
            res.setHeader("Content-Type", "application/octet-stream");
            res.status(200).send(fileContent);
        } else {
            res.status(404).json({ error: "File not found" });
        }
    } catch (err) {
        console.error("File retrieval error:", err);
        res.status(404).json({ error: "File not found" });
    }
});

module.exports = router;
