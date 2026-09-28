const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
    {
        order: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        reason: { type: String, required: true },
        status: {
            type: String,
            enum: ["Requested", "Approved", "Rejected", "Product Received", "Refund Processed", "Completed"],
            default: "Requested",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("return_request", returnSchema);