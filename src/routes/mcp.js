// Profile Management System - Custom Implementation
const express = require("express");
const User = require("../models/user");
const Profiles = require("../models/profiles");
const authenticateToken = require("../structs/middleware");
const error = require("../structs/error");
const functions = require("../structs/functions");

const router = express.Router();

// Build profile response structure
const buildProfileResponse = (userAccountId, profileName, revisionNum, modifications) => {
    const timestamp = new Date().toISOString();
    return {
        profileRevision: revisionNum,
        profileId: profileName,
        profileChangesBaseRevision: revisionNum - 1,
        profileChanges: modifications,
        profileCommandRevision: revisionNum,
        serverTime: timestamp,
        responseVersion: 1
    };
};

// Initialize empty profile structure
const initializeEmptyProfile = () => ({
    items: {},
    stats: { attributes: { level: 1 } },
    rvn: 1
});

// Profile operation handler
router.post("/fortnite/api/game/v2/profile/:accountId/client/:operation", authenticateToken, async (req, res) => {
    const userAccountId = req.params.accountId;
    const requestedOperation = req.params.operation;
    const targetProfile = req.query.profileId || "athena";
    const currentRevision = parseInt(req.query.rvn) || 0;

    try {
        let userProfileDoc = await Profiles.findOne({ accountId: userAccountId });
        
        if (!userProfileDoc) {
            userProfileDoc = new Profiles({
                accountId: userAccountId,
                profiles: {
                    athena: initializeEmptyProfile(),
                    common_core: initializeEmptyProfile(),
                    creative: initializeEmptyProfile()
                }
            });
            await userProfileDoc.save();
        }

        const activeProfile = userProfileDoc.profiles[targetProfile] || initializeEmptyProfile();
        const modifications = [];

        // Operation router - handle different client requests
        if (requestedOperation === "QueryProfile" || requestedOperation === "ClientQuestLogin") {
            modifications.push({
                changeType: "fullProfileUpdate",
                profile: {
                    _id: userAccountId,
                    Update: new Date().toISOString(),
                    Created: new Date().toISOString(),
                    rvn: activeProfile.rvn,
                    wipeNumber: 1,
                    accountId: userAccountId,
                    profileId: targetProfile,
                    version: "fortnite_12_41",
                    items: activeProfile.items,
                    stats: { attributes: activeProfile.stats.attributes },
                    commandRevision: activeProfile.rvn
                }
            });
        } else if (requestedOperation === "MarkItemSeen") {
            const seenItems = req.body.itemIds || [];
            seenItems.forEach(itemKey => {
                if (activeProfile.items[itemKey]) {
                    activeProfile.items[itemKey].attributes = activeProfile.items[itemKey].attributes || {};
                    activeProfile.items[itemKey].attributes.item_seen = true;
                    modifications.push({
                        changeType: "itemAttrChanged",
                        itemId: itemKey,
                        attributeName: "item_seen",
                        attributeValue: true
                    });
                }
            });
        } else if (requestedOperation === "SetItemFavoriteStatusBatch") {
            const favoriteList = req.body.itemFavoriteStatusList || [];
            favoriteList.forEach(favoriteEntry => {
                if (activeProfile.items[favoriteEntry.itemId]) {
                    activeProfile.items[favoriteEntry.itemId].attributes = activeProfile.items[favoriteEntry.itemId].attributes || {};
                    activeProfile.items[favoriteEntry.itemId].attributes.favorite = favoriteEntry.bFavorite;
                    modifications.push({
                        changeType: "itemAttrChanged",
                        itemId: favoriteEntry.itemId,
                        attributeName: "favorite",
                        attributeValue: favoriteEntry.bFavorite
                    });
                }
            });
        } else if (requestedOperation === "EquipBattleRoyaleCustomization") {
            const equipSlot = req.body.slotName;
            const equipItem = req.body.itemToSlot;
            
            activeProfile.stats.attributes.favorite_loadout = activeProfile.stats.attributes.favorite_loadout || {};
            activeProfile.stats.attributes.favorite_loadout[equipSlot] = equipItem;
            
            modifications.push({
                changeType: "statModified",
                name: "favorite_loadout",
                value: activeProfile.stats.attributes.favorite_loadout
            });
        } else {
            // Default handler for unknown operations
            modifications.push({
                changeType: "fullProfileUpdate",
                profile: {
                    _id: userAccountId,
                    Update: new Date().toISOString(),
                    Created: new Date().toISOString(),
                    rvn: activeProfile.rvn,
                    wipeNumber: 1,
                    accountId: userAccountId,
                    profileId: targetProfile,
                    version: "fortnite_12_41",
                    items: activeProfile.items,
                    stats: { attributes: activeProfile.stats.attributes },
                    commandRevision: activeProfile.rvn
                }
            });
        }

        // Persist changes
        userProfileDoc.profiles[targetProfile] = activeProfile;
        userProfileDoc.profiles[targetProfile].rvn = activeProfile.rvn + 1;
        await userProfileDoc.save();

        const responseData = buildProfileResponse(
            userAccountId,
            targetProfile,
            userProfileDoc.profiles[targetProfile].rvn,
            modifications
        );
        
        res.status(200).json(responseData);

    } catch (err) {
        console.error("Profile operation failed:", err);
        res.status(500).json(error.createError("Profile system error", 500, "errors.com.epicgames.common.server_error"));
    }
});

// Public profile endpoint
router.get("/fortnite/api/game/v2/profile/:accountId/public", async (req, res) => {
    const userAccountId = req.params.accountId;

    try {
        const userDoc = await User.findOne({ accountId: userAccountId });
        if (!userDoc) {
            return res.status(404).json(error.invalidAccount());
        }

        const profileDoc = await Profiles.findOne({ accountId: userAccountId });
        
        res.status(200).json({
            accountId: userAccountId,
            displayName: userDoc.username,
            profileData: profileDoc ? profileDoc.profiles : {}
        });
    } catch (err) {
        console.error("Public profile fetch error:", err);
        res.status(500).json(error.createError("Profile fetch error", 500, "errors.com.epicgames.common.server_error"));
    }
});

module.exports = router;
