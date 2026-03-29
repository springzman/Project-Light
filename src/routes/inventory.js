// Inventory & Cosmetics API - Advanced Item Management
const express = require("express");
const Profiles = require("../models/profiles");
const authenticateToken = require("../structs/middleware");
const error = require("../structs/error");
const log = require("../structs/log");
const { v4: uuid } = require("uuid");

const app = express();

// GET /api/v1/inventory - Get user inventory
app.get("/api/v1/inventory", authenticateToken, async (req, res) => {
    try {
        const profile = await Profiles.findOne({ accountId: req.accountId });

        if (!profile) {
            return res.status(404).json(error.createError("Profile not found", 404));
        }

        res.status(200).json({
            success: true,
            inventory: {
                athena: profile.profiles.athena.items || {},
                commonCore: profile.profiles.common_core.items || {}
            }
        });

    } catch (err) {
        log.error(`Error fetching inventory: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch inventory", 500));
    }
});

// POST /api/v1/inventory/item - Add item to inventory
app.post("/api/v1/inventory/item", authenticateToken, async (req, res) => {
    try {
        const { itemId, itemType, quantity = 1, attributes = {} } = req.body;

        if (!itemId || !itemType) {
            return res.status(400).json(error.invalidBody());
        }

        let profile = await Profiles.findOne({ accountId: req.accountId });

        if (!profile) {
            profile = new Profiles({
                accountId: req.accountId,
                profiles: {
                    athena: { items: {} },
                    common_core: { items: {} }
                }
            });
        }

        const itemGuid = uuid().replace(/-/g, '');
        const newItem = {
            templateId: itemId,
            attributes: {
                item_seen: false,
                favorite: false,
                level: 1,
                xp: 0,
                variants: [],
                ...attributes
            },
            quantity
        };

        // Add to athena profile
        if (!profile.profiles.athena.items) {
            profile.profiles.athena.items = {};
        }
        profile.profiles.athena.items[itemGuid] = newItem;

        await profile.save();

        log.info(`Added item ${itemId} to ${req.accountId} inventory`);

        res.status(200).json({
            success: true,
            message: "Item added to inventory",
            item: {
                id: itemGuid,
                ...newItem
            }
        });

    } catch (err) {
        log.error(`Error adding item to inventory: ${err.message}`);
        res.status(500).json(error.createError("Failed to add item", 500));
    }
});

// DELETE /api/v1/inventory/item/:itemGuid - Remove item from inventory
app.delete("/api/v1/inventory/item/:itemGuid", authenticateToken, async (req, res) => {
    try {
        const { itemGuid } = req.params;

        const profile = await Profiles.findOne({ accountId: req.accountId });

        if (!profile) {
            return res.status(404).json(error.createError("Profile not found", 404));
        }

        if (profile.profiles.athena.items && profile.profiles.athena.items[itemGuid]) {
            delete profile.profiles.athena.items[itemGuid];
            await profile.save();

            log.info(`Removed item ${itemGuid} from ${req.accountId} inventory`);

            res.status(200).json({
                success: true,
                message: "Item removed from inventory"
            });
        } else {
            res.status(404).json(error.createError("Item not found", 404));
        }

    } catch (err) {
        log.error(`Error removing item from inventory: ${err.message}`);
        res.status(500).json(error.createError("Failed to remove item", 500));
    }
});

// POST /api/v1/inventory/equip - Equip cosmetic item
app.post("/api/v1/inventory/equip", authenticateToken, async (req, res) => {
    try {
        const { itemId, slot } = req.body;

        if (!itemId || !slot) {
            return res.status(400).json(error.invalidBody());
        }

        const profile = await Profiles.findOne({ accountId: req.accountId });

        if (!profile) {
            return res.status(404).json(error.createError("Profile not found", 404));
        }

        // Initialize loadout if it doesn't exist
        if (!profile.profiles.athena.loadout) {
            profile.profiles.athena.loadout = {};
        }

        profile.profiles.athena.loadout[slot] = itemId;
        await profile.save();

        log.info(`Equipped ${itemId} to slot ${slot} for ${req.accountId}`);

        res.status(200).json({
            success: true,
            message: `Item equipped to ${slot}`,
            loadout: profile.profiles.athena.loadout
        });

    } catch (err) {
        log.error(`Error equipping item: ${err.message}`);
        res.status(500).json(error.createError("Failed to equip item", 500));
    }
});

// POST /api/v1/inventory/unequip - Unequip cosmetic item
app.post("/api/v1/inventory/unequip", authenticateToken, async (req, res) => {
    try {
        const { slot } = req.body;

        if (!slot) {
            return res.status(400).json(error.invalidBody());
        }

        const profile = await Profiles.findOne({ accountId: req.accountId });

        if (!profile) {
            return res.status(404).json(error.createError("Profile not found", 404));
        }

        if (profile.profiles.athena.loadout && profile.profiles.athena.loadout[slot]) {
            delete profile.profiles.athena.loadout[slot];
            await profile.save();

            log.info(`Unequipped slot ${slot} for ${req.accountId}`);

            res.status(200).json({
                success: true,
                message: `Slot ${slot} unequipped`,
                loadout: profile.profiles.athena.loadout
            });
        } else {
            res.status(404).json(error.createError("Slot not equipped", 404));
        }

    } catch (err) {
        log.error(`Error unequipping item: ${err.message}`);
        res.status(500).json(error.createError("Failed to unequip item", 500));
    }
});

// GET /api/v1/inventory/loadout - Get current loadout
app.get("/api/v1/inventory/loadout", authenticateToken, async (req, res) => {
    try {
        const profile = await Profiles.findOne({ accountId: req.accountId });

        if (!profile) {
            return res.status(404).json(error.createError("Profile not found", 404));
        }

        res.status(200).json({
            success: true,
            loadout: profile.profiles.athena.loadout || {}
        });

    } catch (err) {
        log.error(`Error fetching loadout: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch loadout", 500));
    }
});

// POST /api/v1/inventory/favorite - Toggle favorite on item
app.post("/api/v1/inventory/favorite", authenticateToken, async (req, res) => {
    try {
        const { itemGuid, favorite } = req.body;

        if (!itemGuid || favorite === undefined) {
            return res.status(400).json(error.invalidBody());
        }

        const profile = await Profiles.findOne({ accountId: req.accountId });

        if (!profile) {
            return res.status(404).json(error.createError("Profile not found", 404));
        }

        if (profile.profiles.athena.items && profile.profiles.athena.items[itemGuid]) {
            profile.profiles.athena.items[itemGuid].attributes.favorite = favorite;
            await profile.save();

            log.info(`Set favorite=${favorite} for item ${itemGuid} (${req.accountId})`);

            res.status(200).json({
                success: true,
                message: `Item ${favorite ? 'favorited' : 'unfavorited'}`,
                item: profile.profiles.athena.items[itemGuid]
            });
        } else {
            res.status(404).json(error.createError("Item not found", 404));
        }

    } catch (err) {
        log.error(`Error toggling favorite: ${err.message}`);
        res.status(500).json(error.createError("Failed to toggle favorite", 500));
    }
});

// POST /api/v1/inventory/mark-seen - Mark items as seen
app.post("/api/v1/inventory/mark-seen", authenticateToken, async (req, res) => {
    try {
        const { itemGuids } = req.body;

        if (!Array.isArray(itemGuids)) {
            return res.status(400).json(error.invalidBody());
        }

        const profile = await Profiles.findOne({ accountId: req.accountId });

        if (!profile) {
            return res.status(404).json(error.createError("Profile not found", 404));
        }

        let markedCount = 0;
        itemGuids.forEach(itemGuid => {
            if (profile.profiles.athena.items && profile.profiles.athena.items[itemGuid]) {
                profile.profiles.athena.items[itemGuid].attributes.item_seen = true;
                markedCount++;
            }
        });

        await profile.save();

        log.info(`Marked ${markedCount} items as seen for ${req.accountId}`);

        res.status(200).json({
            success: true,
            message: `Marked ${markedCount} items as seen`
        });

    } catch (err) {
        log.error(`Error marking items as seen: ${err.message}`);
        res.status(500).json(error.createError("Failed to mark items as seen", 500));
    }
});

// GET /api/v1/inventory/cosmetics - Get cosmetics by type
app.get("/api/v1/inventory/cosmetics/:type", authenticateToken, async (req, res) => {
    try {
        const { type } = req.params;
        
        const validTypes = ['outfit', 'backpack', 'pickaxe', 'glider', 'emote', 'wrap', 'contrail', 'loadingscreen', 'music'];
        
        if (!validTypes.includes(type)) {
            return res.status(400).json(error.createError("Invalid cosmetic type", 400));
        }

        const profile = await Profiles.findOne({ accountId: req.accountId });

        if (!profile) {
            return res.status(404).json(error.createError("Profile not found", 404));
        }

        const cosmetics = {};
        const items = profile.profiles.athena.items || {};
        
        Object.keys(items).forEach(guid => {
            const item = items[guid];
            if (item.templateId.includes(type)) {
                cosmetics[guid] = item;
            }
        });

        res.status(200).json({
            success: true,
            type,
            count: Object.keys(cosmetics).length,
            cosmetics
        });

    } catch (err) {
        log.error(`Error fetching cosmetics by type: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch cosmetics", 500));
    }
});

module.exports = app;
