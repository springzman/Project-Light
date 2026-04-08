// Friends Management API - Advanced Social Features
const express = require("express");
const Friends = require("../models/friends");
const User = require("../models/user");
const authenticateToken = require("../structs/middleware");
const error = require("../structs/error");
const log = require("../structs/log");

const app = express();

// GET /api/v1/friends - Get friends list
app.get("/api/v1/friends", authenticateToken, async (req, res) => {
    try {
        let friendsData = await Friends.findOne({ accountId: req.accountId });

        if (!friendsData) {
            friendsData = new Friends({ accountId: req.accountId });
            await friendsData.save();
        }

        // Get usernames for all friends
        const friendIds = friendsData.friends.map(f => f.accountId);
        const users = await User.find({ accountId: { $in: friendIds } })
            .select('accountId username')
            .lean();

        const usernameMap = {};
        users.forEach(user => {
            usernameMap[user.accountId] = user.username;
        });

        const friendsList = friendsData.friends.map(friend => ({
            accountId: friend.accountId,
            username: usernameMap[friend.accountId] || 'Unknown',
            status: friend.status,
            direction: friend.direction,
            created: friend.created,
            favorite: friend.favorite
        }));

        res.status(200).json({
            success: true,
            friends: friendsList,
            count: friendsList.length
        });

    } catch (err) {
        log.error(`Error fetching friends: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch friends", 500));
    }
});

// POST /api/v1/friends/add - Send friend request
app.post("/api/v1/friends/add", authenticateToken, async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json(error.invalidBody());
        }

        // Find target user
        const targetUser = await User.findOne({ username_lower: username.toLowerCase() });

        if (!targetUser) {
            return res.status(404).json(error.createError("User not found", 404));
        }

        if (targetUser.accountId === req.accountId) {
            return res.status(400).json(error.createError("Cannot add yourself as friend", 400));
        }

        // Get both friends lists
        let myFriends = await Friends.findOne({ accountId: req.accountId });
        let theirFriends = await Friends.findOne({ accountId: targetUser.accountId });

        if (!myFriends) {
            myFriends = new Friends({ accountId: req.accountId });
        }
        if (!theirFriends) {
            theirFriends = new Friends({ accountId: targetUser.accountId });
        }

        // Check if already friends
        const alreadyFriend = myFriends.friends.find(f => f.accountId === targetUser.accountId);
        if (alreadyFriend) {
            return res.status(400).json(error.createError("Already friends or request pending", 400));
        }

        // Add friend request (outbound for sender, inbound for receiver)
        myFriends.friends.push({
            accountId: targetUser.accountId,
            status: "PENDING",
            direction: "OUTBOUND",
            created: new Date()
        });

        theirFriends.friends.push({
            accountId: req.accountId,
            status: "PENDING",
            direction: "INBOUND",
            created: new Date()
        });

        await myFriends.save();
        await theirFriends.save();

        log.info(`Friend request sent from ${req.accountId} to ${targetUser.accountId}`);

        res.status(200).json({
            success: true,
            message: `Friend request sent to ${username}`,
            friend: {
                accountId: targetUser.accountId,
                username: targetUser.username,
                status: "PENDING",
                direction: "OUTBOUND"
            }
        });

    } catch (err) {
        log.error(`Error sending friend request: ${err.message}`);
        res.status(500).json(error.createError("Failed to send friend request", 500));
    }
});

// POST /api/v1/friends/accept - Accept friend request
app.post("/api/v1/friends/accept", authenticateToken, async (req, res) => {
    try {
        const { accountId } = req.body;

        if (!accountId) {
            return res.status(400).json(error.invalidBody());
        }

        const myFriends = await Friends.findOne({ accountId: req.accountId });
        const theirFriends = await Friends.findOne({ accountId: accountId });

        if (!myFriends || !theirFriends) {
            return res.status(404).json(error.createError("Friend request not found", 404));
        }

        // Find and update friend requests
        const myFriend = myFriends.friends.find(f => f.accountId === accountId);
        const theirFriend = theirFriends.friends.find(f => f.accountId === req.accountId);

        if (!myFriend || !theirFriend || myFriend.status !== "PENDING") {
            return res.status(404).json(error.createError("Friend request not found", 404));
        }

        // Update status to ACCEPTED
        myFriend.status = "ACCEPTED";
        theirFriend.status = "ACCEPTED";

        await myFriends.save();
        await theirFriends.save();

        log.info(`Friend request accepted between ${req.accountId} and ${accountId}`);

        res.status(200).json({
            success: true,
            message: "Friend request accepted",
            friend: {
                accountId: accountId,
                status: "ACCEPTED"
            }
        });

    } catch (err) {
        log.error(`Error accepting friend request: ${err.message}`);
        res.status(500).json(error.createError("Failed to accept friend request", 500));
    }
});

// DELETE /api/v1/friends/remove - Remove friend
app.delete("/api/v1/friends/remove", authenticateToken, async (req, res) => {
    try {
        const { accountId } = req.body;

        if (!accountId) {
            return res.status(400).json(error.invalidBody());
        }

        const myFriends = await Friends.findOne({ accountId: req.accountId });
        const theirFriends = await Friends.findOne({ accountId: accountId });

        if (!myFriends || !theirFriends) {
            return res.status(404).json(error.createError("Friend not found", 404));
        }

        // Remove from both friends lists
        myFriends.friends = myFriends.friends.filter(f => f.accountId !== accountId);
        theirFriends.friends = theirFriends.friends.filter(f => f.accountId !== req.accountId);

        await myFriends.save();
        await theirFriends.save();

        log.info(`Friend removed between ${req.accountId} and ${accountId}`);

        res.status(200).json({
            success: true,
            message: "Friend removed"
        });

    } catch (err) {
        log.error(`Error removing friend: ${err.message}`);
        res.status(500).json(error.createError("Failed to remove friend", 500));
    }
});

// POST /api/v1/friends/block - Block user
app.post("/api/v1/friends/block", authenticateToken, async (req, res) => {
    try {
        const { accountId } = req.body;

        if (!accountId) {
            return res.status(400).json(error.invalidBody());
        }

        let friendsData = await Friends.findOne({ accountId: req.accountId });

        if (!friendsData) {
            friendsData = new Friends({ accountId: req.accountId });
        }

        // Check if already blocked
        const alreadyBlocked = friendsData.blocked.find(b => b.accountId === accountId);
        if (alreadyBlocked) {
            return res.status(400).json(error.createError("User already blocked", 400));
        }

        // Remove from friends if they are friends
        friendsData.friends = friendsData.friends.filter(f => f.accountId !== accountId);

        // Add to blocked list
        friendsData.blocked.push({
            accountId: accountId,
            created: new Date()
        });

        await friendsData.save();

        log.info(`User ${accountId} blocked by ${req.accountId}`);

        res.status(200).json({
            success: true,
            message: "User blocked"
        });

    } catch (err) {
        log.error(`Error blocking user: ${err.message}`);
        res.status(500).json(error.createError("Failed to block user", 500));
    }
});

// DELETE /api/v1/friends/unblock - Unblock user
app.delete("/api/v1/friends/unblock", authenticateToken, async (req, res) => {
    try {
        const { accountId } = req.body;

        if (!accountId) {
            return res.status(400).json(error.invalidBody());
        }

        const friendsData = await Friends.findOne({ accountId: req.accountId });

        if (!friendsData) {
            return res.status(404).json(error.createError("Blocked list not found", 404));
        }

        // Remove from blocked list
        friendsData.blocked = friendsData.blocked.filter(b => b.accountId !== accountId);

        await friendsData.save();

        log.info(`User ${accountId} unblocked by ${req.accountId}`);

        res.status(200).json({
            success: true,
            message: "User unblocked"
        });

    } catch (err) {
        log.error(`Error unblocking user: ${err.message}`);
        res.status(500).json(error.createError("Failed to unblock user", 500));
    }
});

// GET /api/v1/friends/blocked - Get blocked users list
app.get("/api/v1/friends/blocked", authenticateToken, async (req, res) => {
    try {
        const friendsData = await Friends.findOne({ accountId: req.accountId });

        if (!friendsData) {
            return res.status(200).json({
                success: true,
                blocked: [],
                count: 0
            });
        }

        // Get usernames for blocked users
        const blockedIds = friendsData.blocked.map(b => b.accountId);
        const users = await User.find({ accountId: { $in: blockedIds } })
            .select('accountId username')
            .lean();

        const usernameMap = {};
        users.forEach(user => {
            usernameMap[user.accountId] = user.username;
        });

        const blockedList = friendsData.blocked.map(blocked => ({
            accountId: blocked.accountId,
            username: usernameMap[blocked.accountId] || 'Unknown',
            created: blocked.created
        }));

        res.status(200).json({
            success: true,
            blocked: blockedList,
            count: blockedList.length
        });

    } catch (err) {
        log.error(`Error fetching blocked list: ${err.message}`);
        res.status(500).json(error.createError("Failed to fetch blocked list", 500));
    }
});

// POST /api/v1/friends/favorite - Toggle favorite status
app.post("/api/v1/friends/favorite", authenticateToken, async (req, res) => {
    try {
        const { accountId, favorite } = req.body;

        if (!accountId || favorite === undefined) {
            return res.status(400).json(error.invalidBody());
        }

        const friendsData = await Friends.findOne({ accountId: req.accountId });

        if (!friendsData) {
            return res.status(404).json(error.createError("Friends list not found", 404));
        }

        const friend = friendsData.friends.find(f => f.accountId === accountId);

        if (!friend) {
            return res.status(404).json(error.createError("Friend not found", 404));
        }

        friend.favorite = favorite;

        await friendsData.save();

        log.info(`Friend ${accountId} ${favorite ? 'favorited' : 'unfavorited'} by ${req.accountId}`);

        res.status(200).json({
            success: true,
            message: `Friend ${favorite ? 'favorited' : 'unfavorited'}`
        });

    } catch (err) {
        log.error(`Error toggling favorite: ${err.message}`);
        res.status(500).json(error.createError("Failed to toggle favorite", 500));
    }
});

module.exports = app;
