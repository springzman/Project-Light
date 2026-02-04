const { verifyToken } = require("../tokenManager/tokenVerify");
const error = require("../structs/error");
const User = require("../models/user");

async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json(error.invalidToken());
    }

    const token = authHeader.replace("bearer ", "").replace("Bearer ", "");
    const tokenVerification = verifyToken(token);

    if (!tokenVerification.valid) {
        return res.status(401).json(error.invalidToken());
    }

    const user = await User.findOne({ accountId: tokenVerification.decoded.accountId });
    if (!user) {
        return res.status(401).json(error.invalidAccount());
    }

    if (user.banned) {
        return res.status(403).json(error.createError("Your account has been banned", 403, "errors.com.epicgames.account.account_banned"));
    }

    req.user = user;
    req.accountId = user.accountId;
    next();
}

module.exports = authenticateToken;
