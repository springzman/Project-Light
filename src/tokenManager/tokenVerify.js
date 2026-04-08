const jwt = require("jsonwebtoken");
const functions = require("../structs/functions");

function verifyToken(token) {
    try {
        if (token.startsWith("eg1~")) {
            token = token.slice(4);
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || global.JWT_SECRET);
        
        // Check if token is expired
        const expirationDate = functions.DateAddHours(new Date(decoded.creation_date), decoded.hours_expire);
        if (expirationDate.getTime() <= new Date().getTime()) {
            return { valid: false, reason: "expired" };
        }
        
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, reason: "invalid" };
    }
}

module.exports = {
    verifyToken
};
