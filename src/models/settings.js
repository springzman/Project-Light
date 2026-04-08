const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema(
    {
        accountId: { type: String, required: true, unique: true },
        settings: {
            // Game Settings
            gameplay: {
                mouseSensitivity: { type: Number, default: 0.5 },
                controllerSensitivity: { type: Number, default: 0.5 },
                autoRun: { type: Boolean, default: false },
                sprintByDefault: { type: Boolean, default: false },
                autoOpenDoors: { type: Boolean, default: false },
                autoPickupWeapons: { type: Boolean, default: true },
                autoSortConsumables: { type: Boolean, default: true },
                turboBuilding: { type: Boolean, default: true },
                editModeAimAssist: { type: Boolean, default: true }
            },
            // Audio Settings
            audio: {
                masterVolume: { type: Number, default: 1.0 },
                musicVolume: { type: Number, default: 0.5 },
                sfxVolume: { type: Number, default: 1.0 },
                dialogueVolume: { type: Number, default: 1.0 },
                voiceChatEnabled: { type: Boolean, default: true },
                voiceChatVolume: { type: Number, default: 0.8 },
                subtitles: { type: Boolean, default: false },
                visualizeSound: { type: Boolean, default: false }
            },
            // Video Settings
            video: {
                windowMode: { type: String, default: "Fullscreen" },
                resolution: { type: String, default: "1920x1080" },
                frameRateLimit: { type: Number, default: 240 },
                qualityPreset: { type: String, default: "Epic" },
                vsync: { type: Boolean, default: false },
                motionBlur: { type: Boolean, default: false },
                showFPS: { type: Boolean, default: true },
                allowMultithreadedRendering: { type: Boolean, default: true }
            },
            // HUD Settings
            hud: {
                hudScale: { type: Number, default: 1.0 },
                showPlayerNames: { type: Boolean, default: true },
                showDamageNumbers: { type: Boolean, default: true },
                showMaterialCount: { type: Boolean, default: true },
                showAmmoCount: { type: Boolean, default: true },
                showHealthBar: { type: Boolean, default: true },
                showShieldBar: { type: Boolean, default: true },
                showReticle: { type: Boolean, default: true }
            },
            // Privacy Settings
            privacy: {
                showOnlineStatus: { type: Boolean, default: true },
                allowFriendRequests: { type: Boolean, default: true },
                allowPartyInvites: { type: Boolean, default: true },
                allowWhispers: { type: Boolean, default: true },
                hideMatchmakingRegion: { type: Boolean, default: false }
            },
            // Social Settings
            social: {
                allowGifts: { type: Boolean, default: true },
                showCareerStats: { type: Boolean, default: true },
                allowSpectators: { type: Boolean, default: true }
            },
            // Keybinds (stored as JSON)
            keybinds: {
                type: mongoose.Schema.Types.Mixed,
                default: {
                    moveForward: "W",
                    moveBackward: "S",
                    moveLeft: "A",
                    moveRight: "D",
                    jump: "Space",
                    crouch: "LeftCtrl",
                    sprint: "LeftShift",
                    use: "E",
                    reload: "R",
                    fire: "LeftMouseButton",
                    aim: "RightMouseButton",
                    switchMode: "F1",
                    inventorySlot1: "1",
                    inventorySlot2: "2",
                    inventorySlot3: "3",
                    inventorySlot4: "4",
                    inventorySlot5: "5",
                    buildWall: "Q",
                    buildFloor: "C",
                    buildStairs: "V",
                    buildRoof: "LeftAlt",
                    editBuild: "G",
                    map: "M",
                    inventory: "Tab",
                    emote: "B"
                }
            }
        },
        lastUpdated: { type: Date, default: Date.now }
    },
    {
        collection: "settings"
    }
);

// Update lastUpdated on save
SettingsSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    next();
});

const model = mongoose.model('Settings', SettingsSchema);

module.exports = model;
