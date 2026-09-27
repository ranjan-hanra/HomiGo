const { Schema } = require("mongoose");

const ProviderSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phoneNo: {
        type: String,
        required: true
    },

    isVerified: {
        type: Boolean,
        default: true
    },

    isAvailable: {
        type: Boolean,
        default: true
    }
});

module.exports = {
    ProviderSchema
};