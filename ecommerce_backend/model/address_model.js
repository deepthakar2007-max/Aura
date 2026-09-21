const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        fullname: {
            type: String,
            required: true
        },

        mobile: {
            type: Number,
            required: true
        },

        pincode: {
            type: String,
            maxlength: 6,
            required: true
        },

        address: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },

        city: {
            type: String,
            required: true
        },

        landmark: {
            type: String,
        },

        addresstype: {
            type: String,
            enum: ["Home", "Work", "Other"]
        }
    },
    {
        timestamps: true,
    }
);

const addressModel = mongoose.model("address", addressSchema);

module.exports = addressModel;