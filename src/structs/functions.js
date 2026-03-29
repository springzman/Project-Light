const { v4: uuid } = require("uuid");

function MakeID() {
    return uuid();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function DateAddHours(date, hours) {
    date.setHours(date.getHours() + hours);
    return date;
}

function getTimestamp() {
    return new Date().toISOString();
}

module.exports = {
    MakeID,
    sleep,
    DateAddHours,
    getTimestamp
};
