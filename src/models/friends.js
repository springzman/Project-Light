const mongoose = require("mongoose");

const FriendsSchema = new mongoose.Schema(
    {
        accountId: { type: String, required: true, unique: true },
        friends: [
            {
                accountId: { type: String, required: true },
                status: { type: String, default: "ACCEPTED" }, // ACCEPTED, PENDING
                direction: { type: String, default: "OUTBOUND" }, // OUTBOUND, INBOUND
                created: { type: Date, default: Date.now },
                favorite: { type: Boolean, default: false }
            }
        ],
        blocked: [
            {
                accountId: { type: String, required: true },
                created: { type: Date, default: Date.now }
            }
        ]
    },
    {
        collection: "friends"
    }
);

const model = mongoose.model('Friends', FriendsSchema);

module.exports = model;
