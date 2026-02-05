// Content Pages System - Custom Implementation
const express = require("express");

const router = express.Router();

// Content pages data structure
const buildContentPagesResponse = () => {
    const currentTime = new Date().toISOString();
    
    return {
        _title: "Fortnite Game",
        _activeDate: currentTime,
        lastModified: currentTime,
        _locale: "en-US",
        _templateName: "FortniteGameClient",
        battleroyalenews: {
            _title: "Battle Royale News",
            _activeDate: currentTime,
            lastModified: currentTime,
            _locale: "en-US",
            news: {
                _type: "CommonUI Simple Message",
                title: "Welcome to Project Light",
                body: "Custom Fortnite Backend - Season 12.41",
                spotlight: false
            }
        },
        emergencynotice: {
            _title: "Emergency Notice",
            _activeDate: currentTime,
            lastModified: currentTime,
            _locale: "en-US",
            emergencynotices: {
                _type: "CommonUI Simple Message",
                title: "",
                body: ""
            }
        },
        tournamentinformation: {
            _title: "Tournament Information",
            _activeDate: currentTime,
            lastModified: currentTime,
            _locale: "en-US",
            tournament_info: {
                tournaments: []
            }
        },
        subgameselectdata: {
            _title: "Subgame Select Data",
            _activeDate: currentTime,
            lastModified: currentTime,
            _locale: "en-US",
            saveTheWorldUnowned: {
                _type: "CommonUI Simple Message",
                message: {
                    title: "Save the World",
                    body: "Save the World is not available on this server."
                }
            }
        }
    };
};

// Get Fortnite game content pages
router.get("/content/api/pages/fortnite-game", (req, res) => {
    try {
        const contentData = buildContentPagesResponse();
        res.status(200).json(contentData);
    } catch (err) {
        console.error("Content pages error:", err);
        res.status(500).json({ error: "Failed to load content" });
    }
});

// Additional content endpoint
router.get("/content/api/pages/:pageName", (req, res) => {
    const pageName = req.params.pageName;
    
    try {
        if (pageName === "fortnite-game") {
            const contentData = buildContentPagesResponse();
            return res.status(200).json(contentData);
        }
        
        res.status(200).json({
            _title: pageName,
            _activeDate: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            _locale: "en-US"
        });
    } catch (err) {
        console.error("Content page error:", err);
        res.status(500).json({ error: "Failed to load content" });
    }
});

module.exports = router;
