const jwt = require("jsonwebtoken");
const functions = require("../structs/functions");

function createToken(accountId, clientId, grantType, deviceId, hours) {
    const token = jwt.sign({
        accountId,
        clientId,
        grantType,
        deviceId,
        creation_date: new Date().toISOString(),
        hours_expire: hours
    }, process.env.JWT_SECRET || global.JWT_SECRET);
    
    return `eg1~${token}`;
}

function createAccessToken(accountId, clientId, grantType, deviceId) {
    return createToken(accountId, clientId, grantType, deviceId, 8);
}

function createRefreshToken(accountId, clientId, grantType, deviceId) {
    return createToken(accountId, clientId, grantType, deviceId, 24);
}

function createClientToken(clientId, grantType) {
    return createToken("", clientId, grantType, "", 4);
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    createClientToken
};
