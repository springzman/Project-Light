// Stats API Routes - Advanced Statistics & Analytics
const express = require("express");
const Stats = require("../models/stats");
const User = require("../models/user");
const authenticateToken = require("../structs/middleware");
const error = require("../structs/error");
const log = require("../structs/log");

const app = express();

// GET /api/v1/stats - Get user stats
app.get("/api/v1/stats", authenticateToken, async (req, res) => {
    try {
        let stats = await Stats.findOne({ accountId: req.accountId });

        if (!stats) {
            stats = new Stats({
                accountId: req.accountId
            });
            await stats.save();
        }

        res.status(200).json({
            success: true,
            stats: stats.stats,
            records: stats.records,
            achievements: stats.achievements,
            lastUpdated: stats.lastUpdated
        });

    } catch (err) {
        log.error(`Error fetching stats: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch stats", 500));
    }
});

// GET /api/v1/stats/:accountId - Get stats for specific user
app.get("/api/v1/stats/:accountId", authenticateToken, async (req, res) => {
    try {
        const stats = await Stats.findOne({ accountId: req.params.accountId });

        if (!stats) {
            return res.status(404).json(error.createError("Stats not found", 404));
        }

        res.status(200).json({
            success: true,
            accountId: req.params.accountId,
            stats: stats.stats,
            records: stats.records,
            lastUpdated: stats.lastUpdated
        });

    } catch (err) {
        log.error(`Error fetching stats: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch stats", 500));
    }
});

// POST /api/v1/stats/update - Update stats after match
app.post("/api/v1/stats/update", authenticateToken, async (req, res) => {
    try {
        const { mode, matchData } = req.body;

        if (!mode || !matchData) {
            return res.status(400).json(error.invalidBody());
        }

        let stats = await Stats.findOne({ accountId: req.accountId });

        if (!stats) {
            stats = new Stats({ accountId: req.accountId });
        }

        // Update overall stats
        stats.stats.overall.matchesPlayed += 1;
        stats.stats.overall.kills += matchData.kills || 0;
        stats.stats.overall.deaths += matchData.deaths || 0;
        stats.stats.overall.assists += matchData.assists || 0;
        stats.stats.overall.damageDealt += matchData.damageDealt || 0;
        stats.stats.overall.damageTaken += matchData.damageTaken || 0;
        stats.stats.overall.materialsGathered += matchData.materialsGathered || 0;
        stats.stats.overall.materialsUsed += matchData.materialsUsed || 0;
        stats.stats.overall.timePlayedSeconds += matchData.timePlayedSeconds || 0;

        if (matchData.won) {
            stats.stats.overall.wins += 1;
        }

        // Update mode-specific stats
        const modeStats = stats.stats[mode.toLowerCase()];
        if (modeStats) {
            modeStats.matchesPlayed += 1;
            modeStats.kills += matchData.kills || 0;
            modeStats.deaths += matchData.deaths || 0;
            
            if (matchData.won) {
                modeStats.wins += 1;
            }

            // Update placement stats based on mode
            if (mode === 'solo') {
                if (matchData.placement <= 10) modeStats.top10 += 1;
                if (matchData.placement <= 25) modeStats.top25 += 1;
            } else if (mode === 'duo') {
                if (matchData.placement <= 5) modeStats.top5 += 1;
                if (matchData.placement <= 12) modeStats.top12 += 1;
            } else if (mode === 'squad') {
                if (matchData.placement <= 3) modeStats.top3 += 1;
                if (matchData.placement <= 6) modeStats.top6 += 1;
            }
        }

        // Update personal records
        if (matchData.kills > stats.records.mostKillsInMatch) {
            stats.records.mostKillsInMatch = matchData.kills;
        }
        if (matchData.damageDealt > stats.records.mostDamageInMatch) {
            stats.records.mostDamageInMatch = matchData.damageDealt;
        }
        if (matchData.timePlayedSeconds > stats.records.longestSurvivalTime) {
            stats.records.longestSurvivalTime = matchData.timePlayedSeconds;
        }

        await stats.save();

        log.info(`Updated stats for ${req.accountId} after ${mode} match`);

        res.status(200).json({
            success: true,
            message: "Stats updated successfully",
            stats: stats.stats,
            records: stats.records
        });

    } catch (err) {
        log.error(`Error updating stats: ${err.message}`);
        res.status(500).json(error.createError("Failed to update stats", 500));
    }
});

// GET /api/v1/leaderboard/:mode - Get leaderboard for specific mode
app.get("/api/v1/leaderboard/:mode", async (req, res) => {
    try {
        const { mode } = req.params;
        const { limit = 100, sortBy = 'wins' } = req.query;

        const validModes = ['overall', 'solo', 'duo', 'squad'];
        if (!validModes.includes(mode)) {
            return res.status(400).json(error.createError("Invalid mode", 400));
        }

        const validSortBy = ['wins', 'kills', 'kd', 'winrate'];
        if (!validSortBy.includes(sortBy)) {
            return res.status(400).json(error.createError("Invalid sort field", 400));
        }

        // Build sort query
        const sortQuery = {};
        sortQuery[`stats.${mode}.${sortBy}`] = -1;

        const leaderboard = await Stats.find()
            .sort(sortQuery)
            .limit(parseInt(limit))
            .select(`accountId stats.${mode}`)
            .lean();

        // Get usernames
        const accountIds = leaderboard.map(entry => entry.accountId);
        const users = await User.find({ accountId: { $in: accountIds } })
            .select('accountId username')
            .lean();

        const usernameMap = {};
        users.forEach(user => {
            usernameMap[user.accountId] = user.username;
        });

        const leaderboardData = leaderboard.map((entry, index) => ({
            rank: index + 1,
            accountId: entry.accountId,
            username: usernameMap[entry.accountId] || 'Unknown',
            stats: entry.stats[mode]
        }));

        res.status(200).json({
            success: true,
            mode,
            sortBy,
            count: leaderboardData.length,
            leaderboard: leaderboardData
        });

    } catch (err) {
        log.error(`Error fetching leaderboard: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch leaderboard", 500));
    }
});

// GET /api/v1/stats/achievements - Get user achievements
app.get("/api/v1/stats/achievements", authenticateToken, async (req, res) => {
    try {
        const stats = await Stats.findOne({ accountId: req.accountId });

        if (!stats) {
            return res.status(404).json(error.createError("Stats not found", 404));
        }

        res.status(200).json({
            success: true,
            achievements: stats.achievements,
            count: stats.achievements.length
        });

    } catch (err) {
        log.error(`Error fetching achievements: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch achievements", 500));
    }
});

// POST /api/v1/stats/achievements - Unlock achievement
app.post("/api/v1/stats/achievements", authenticateToken, async (req, res) => {
    try {
        const { achievementId, name, description, progress, maxProgress } = req.body;

        let stats = await Stats.findOne({ accountId: req.accountId });

        if (!stats) {
            stats = new Stats({ accountId: req.accountId });
        }

        // Check if already unlocked
        const existing = stats.achievements.find(a => a.id === achievementId);
        
        if (existing) {
            existing.progress = progress;
            if (progress >= maxProgress) {
                existing.unlockedAt = new Date();
            }
        } else {
            stats.achievements.push({
                id: achievementId,
                name,
                description,
                progress: progress || 0,
                maxProgress: maxProgress || 1,
                unlockedAt: progress >= (maxProgress || 1) ? new Date() : null
            });
        }

        await stats.save();

        res.status(200).json({
            success: true,
            message: "Achievement updated",
            achievements: stats.achievements
        });

    } catch (err) {
        log.error(`Error unlocking achievement: ${err.message}`);
        res.status(500).json(error.createError("Failed to unlock achievement", 500));
    }
});

// GET /api/v1/stats/summary - Get stats summary
app.get("/api/v1/stats/summary", authenticateToken, async (req, res) => {
    try {
        const stats = await Stats.findOne({ accountId: req.accountId });

        if (!stats) {
            return res.status(404).json(error.createError("Stats not found", 404));
        }

        const summary = {
            overall: {
                matchesPlayed: stats.stats.overall.matchesPlayed,
                wins: stats.stats.overall.wins,
                kills: stats.stats.overall.kills,
                kd: stats.stats.overall.deaths > 0 ? 
                    (stats.stats.overall.kills / stats.stats.overall.deaths).toFixed(2) : 0,
                winrate: stats.stats.overall.matchesPlayed > 0 ?
                    ((stats.stats.overall.wins / stats.stats.overall.matchesPlayed) * 100).toFixed(2) : 0
            },
            records: stats.records,
            achievementsUnlocked: stats.achievements.filter(a => a.unlockedAt).length,
            totalAchievements: stats.achievements.length
        };

        res.status(200).json({
            success: true,
            summary
        });

    } catch (err) {
        log.error(`Error fetching stats summary: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch stats summary", 500));
    }
});

module.exports = app;
