const mongoose = require("mongoose");

const StatsSchema = new mongoose.Schema(
    {
        accountId: { type: String, required: true, unique: true },
        stats: {
            // Overall Stats
            overall: {
                matchesPlayed: { type: Number, default: 0 },
                wins: { type: Number, default: 0 },
                kills: { type: Number, default: 0 },
                deaths: { type: Number, default: 0 },
                assists: { type: Number, default: 0 },
                revives: { type: Number, default: 0 },
                damageDealt: { type: Number, default: 0 },
                damageTaken: { type: Number, default: 0 },
                materialsGathered: { type: Number, default: 0 },
                materialsUsed: { type: Number, default: 0 },
                distanceTraveled: { type: Number, default: 0 },
                timePlayedSeconds: { type: Number, default: 0 }
            },
            // Solo Stats
            solo: {
                matchesPlayed: { type: Number, default: 0 },
                wins: { type: Number, default: 0 },
                top10: { type: Number, default: 0 },
                top25: { type: Number, default: 0 },
                kills: { type: Number, default: 0 },
                deaths: { type: Number, default: 0 },
                kd: { type: Number, default: 0 },
                winrate: { type: Number, default: 0 }
            },
            // Duo Stats
            duo: {
                matchesPlayed: { type: Number, default: 0 },
                wins: { type: Number, default: 0 },
                top5: { type: Number, default: 0 },
                top12: { type: Number, default: 0 },
                kills: { type: Number, default: 0 },
                deaths: { type: Number, default: 0 },
                kd: { type: Number, default: 0 },
                winrate: { type: Number, default: 0 }
            },
            // Squad Stats
            squad: {
                matchesPlayed: { type: Number, default: 0 },
                wins: { type: Number, default: 0 },
                top3: { type: Number, default: 0 },
                top6: { type: Number, default: 0 },
                kills: { type: Number, default: 0 },
                deaths: { type: Number, default: 0 },
                kd: { type: Number, default: 0 },
                winrate: { type: Number, default: 0 }
            },
            // LTM Stats
            ltm: {
                matchesPlayed: { type: Number, default: 0 },
                wins: { type: Number, default: 0 },
                kills: { type: Number, default: 0 }
            },
            // Creative Stats
            creative: {
                islandsVisited: { type: Number, default: 0 },
                timePlayedSeconds: { type: Number, default: 0 }
            },
            // Season Stats
            currentSeason: {
                level: { type: Number, default: 1 },
                xp: { type: Number, default: 0 },
                battleStarCount: { type: Number, default: 0 },
                tierProgress: { type: Number, default: 0 }
            }
        },
        // Personal Records
        records: {
            mostKillsInMatch: { type: Number, default: 0 },
            longestElimination: { type: Number, default: 0 },
            longestSurvivalTime: { type: Number, default: 0 },
            mostDamageInMatch: { type: Number, default: 0 }
        },
        // Achievements
        achievements: [
            {
                id: String,
                name: String,
                description: String,
                unlockedAt: Date,
                progress: Number,
                maxProgress: Number
            }
        ],
        lastUpdated: { type: Date, default: Date.now }
    },
    {
        collection: "stats"
    }
);

// Calculate derived stats on save
StatsSchema.pre('save', function(next) {
    this.lastUpdated = new Date();
    
    // Calculate K/D ratios
    if (this.stats.solo.deaths > 0) {
        this.stats.solo.kd = (this.stats.solo.kills / this.stats.solo.deaths).toFixed(2);
    }
    if (this.stats.duo.deaths > 0) {
        this.stats.duo.kd = (this.stats.duo.kills / this.stats.duo.deaths).toFixed(2);
    }
    if (this.stats.squad.deaths > 0) {
        this.stats.squad.kd = (this.stats.squad.kills / this.stats.squad.deaths).toFixed(2);
    }
    
    // Calculate win rates
    if (this.stats.solo.matchesPlayed > 0) {
        this.stats.solo.winrate = ((this.stats.solo.wins / this.stats.solo.matchesPlayed) * 100).toFixed(2);
    }
    if (this.stats.duo.matchesPlayed > 0) {
        this.stats.duo.winrate = ((this.stats.duo.wins / this.stats.duo.matchesPlayed) * 100).toFixed(2);
    }
    if (this.stats.squad.matchesPlayed > 0) {
        this.stats.squad.winrate = ((this.stats.squad.wins / this.stats.squad.matchesPlayed) * 100).toFixed(2);
    }
    
    next();
});

const model = mongoose.model('Stats', StatsSchema);

module.exports = model;
