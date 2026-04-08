const mongoose = require("mongoose");

const ProfilesSchema = new mongoose.Schema(
    {
        accountId: { type: String, required: true, unique: true },
        profiles: {
            athena: { type: Object, default: {} },
            common_core: { type: Object, default: {} },
            creative: { type: Object, default: {} }
        }
    },
    {
        collection: "profiles"
    }
);

const model = mongoose.model('Profiles', ProfilesSchema);

module.exports = model;
