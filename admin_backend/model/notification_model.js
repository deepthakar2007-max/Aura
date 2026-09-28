const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ["order", "customer", "stock", "review", "return", "payment"], required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);