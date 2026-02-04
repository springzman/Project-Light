const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        created: { type: Date, required: true, default: Date.now },
        banned: { type: Boolean, default: false },
        discordId: { type: String, default: null, unique: true, sparse: true },
        accountId: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        username_lower: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        matchmakingId: { type: String, required: true, unique: true },
        vbucks: { type: Number, default: 0 }
    },
    {
        collection: "users"
    }
);

const model = mongoose.model('User', UserSchema);

module.exports = model;
