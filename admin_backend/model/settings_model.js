const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        storeName: { type: String, default: "AURA" },
        storeEmail: { type: String, default: "" },
        storePhone: { type: String, default: "" },
        storeAddress: { type: String, default: "" },
        currency: { type: String, default: "INR" },
        taxRate: { type: Number, default: 8 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("settings", settingsSchema);