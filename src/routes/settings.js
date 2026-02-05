// Settings API Routes - Advanced User Settings Management
const express = require("express");
const fs = require("fs");
const path = require("path");
const Settings = require("../models/settings");
const authenticateToken = require("../structs/middleware");
const error = require("../structs/error");
const log = require("../structs/log");

const app = express();

// Settings storage directory
const SETTINGS_DIR = path.join(__dirname, "../../storage/settings");

// Ensure settings directory exists
if (!fs.existsSync(SETTINGS_DIR)) {
    fs.mkdirSync(SETTINGS_DIR, { recursive: true });
}

// GET /api/v1/settings - Get user settings
app.get("/api/v1/settings", authenticateToken, async (req, res) => {
    try {
        let settings = await Settings.findOne({ accountId: req.accountId });

        // If no settings exist, create default
        if (!settings) {
            settings = new Settings({
                accountId: req.accountId,
                settings: {} // Will use schema defaults
            });
            await settings.save();
            log.info(`Created default settings for ${req.accountId}`);
        }

        res.status(200).json({
            success: true,
            settings: settings.settings,
            lastUpdated: settings.lastUpdated
        });

    } catch (err) {
        log.error(`Error fetching settings: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch settings", 500));
    }
});

// PUT /api/v1/settings - Update user settings
app.put("/api/v1/settings", authenticateToken, async (req, res) => {
    try {
        const { settings: newSettings } = req.body;

        if (!newSettings) {
            return res.status(400).json(error.invalidBody());
        }

        let settings = await Settings.findOne({ accountId: req.accountId });

        if (!settings) {
            settings = new Settings({
                accountId: req.accountId,
                settings: newSettings
            });
        } else {
            // Deep merge settings
            settings.settings = {
                ...settings.settings,
                ...newSettings,
                gameplay: { ...settings.settings.gameplay, ...newSettings.gameplay },
                audio: { ...settings.settings.audio, ...newSettings.audio },
                video: { ...settings.settings.video, ...newSettings.video },
                hud: { ...settings.settings.hud, ...newSettings.hud },
                privacy: { ...settings.settings.privacy, ...newSettings.privacy },
                social: { ...settings.settings.social, ...newSettings.social },
                keybinds: { ...settings.settings.keybinds, ...newSettings.keybinds }
            };
        }

        await settings.save();

        // Also save to file for backup
        const settingsFile = path.join(SETTINGS_DIR, `${req.accountId}.json`);
        fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2));

        log.info(`Updated settings for ${req.accountId}`);

        res.status(200).json({
            success: true,
            message: "Settings updated successfully",
            settings: settings.settings,
            lastUpdated: settings.lastUpdated
        });

    } catch (err) {
        log.error(`Error updating settings: ${err.message}`);
        res.status(500).json(error.createError("Failed to update settings", 500));
    }
});

// PATCH /api/v1/settings/:category - Update specific settings category
app.patch("/api/v1/settings/:category", authenticateToken, async (req, res) => {
    try {
        const { category } = req.params;
        const updates = req.body;

        const validCategories = ['gameplay', 'audio', 'video', 'hud', 'privacy', 'social', 'keybinds'];
        
        if (!validCategories.includes(category)) {
            return res.status(400).json(error.createError(`Invalid category: ${category}`, 400));
        }

        let settings = await Settings.findOne({ accountId: req.accountId });

        if (!settings) {
            settings = new Settings({ accountId: req.accountId });
        }

        settings.settings[category] = {
            ...settings.settings[category],
            ...updates
        };

        await settings.save();

        res.status(200).json({
            success: true,
            message: `${category} settings updated`,
            [category]: settings.settings[category],
            lastUpdated: settings.lastUpdated
        });

    } catch (err) {
        log.error(`Error updating ${req.params.category} settings: ${err.message}`);
        res.status(500).json(error.createError("Failed to update settings category", 500));
    }
});

// DELETE /api/v1/settings - Reset settings to defaults
app.delete("/api/v1/settings", authenticateToken, async (req, res) => {
    try {
        await Settings.findOneAndDelete({ accountId: req.accountId });

        // Delete backup file
        const settingsFile = path.join(SETTINGS_DIR, `${req.accountId}.json`);
        if (fs.existsSync(settingsFile)) {
            fs.unlinkSync(settingsFile);
        }

        log.info(`Reset settings to defaults for ${req.accountId}`);

        res.status(200).json({
            success: true,
            message: "Settings reset to defaults"
        });

    } catch (err) {
        log.error(`Error resetting settings: ${err.message}`);
        res.status(500).json(error.createError("Failed to reset settings", 500));
    }
});

// POST /api/v1/settings/export - Export settings to file
app.post("/api/v1/settings/export", authenticateToken, async (req, res) => {
    try {
        const settings = await Settings.findOne({ accountId: req.accountId });

        if (!settings) {
            return res.status(404).json(error.createError("No settings found", 404));
        }

        const exportData = {
            accountId: req.accountId,
            exportedAt: new Date().toISOString(),
            settings: settings.settings
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="settings-${req.accountId}.json"`);
        res.status(200).json(exportData);

    } catch (err) {
        log.error(`Error exporting settings: ${err.message}`);
        res.status(500).json(error.createError("Failed to export settings", 500));
    }
});

// POST /api/v1/settings/import - Import settings from file
app.post("/api/v1/settings/import", authenticateToken, async (req, res) => {
    try {
        const { settings: importedSettings } = req.body;

        if (!importedSettings) {
            return res.status(400).json(error.invalidBody());
        }

        let settings = await Settings.findOne({ accountId: req.accountId });

        if (!settings) {
            settings = new Settings({
                accountId: req.accountId,
                settings: importedSettings
            });
        } else {
            settings.settings = importedSettings;
        }

        await settings.save();

        log.info(`Imported settings for ${req.accountId}`);

        res.status(200).json({
            success: true,
            message: "Settings imported successfully",
            settings: settings.settings
        });

    } catch (err) {
        log.error(`Error importing settings: ${err.message}`);
        res.status(500).json(error.createError("Failed to import settings", 500));
    }
});

// GET /api/v1/settings/backup - Get all backed up settings files
app.get("/api/v1/settings/backup/list", authenticateToken, async (req, res) => {
    try {
        const files = fs.readdirSync(SETTINGS_DIR);
        const backups = files.map(file => {
            const stats = fs.statSync(path.join(SETTINGS_DIR, file));
            return {
                filename: file,
                accountId: file.replace('.json', ''),
                size: stats.size,
                lastModified: stats.mtime
            };
        });

        res.status(200).json({
            success: true,
            count: backups.length,
            backups
        });

    } catch (err) {
        log.error(`Error listing backup files: ${err.message}`);
        res.status(500).json(error.createError("Failed to list backups", 500));
    }
});

module.exports = app;
