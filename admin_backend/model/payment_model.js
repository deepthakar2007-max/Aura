const mongoose = require("mongoose");

const paySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        order: { type: mongoose.Schema.Types.ObjectId, ref: "order" },
        amount: Number,
        paymethod: { type: String, enum: ["COD", "UPI"] },
        paystatus: { type: String, enum: ["success", "pending", "failed", "refunded"], default: "pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("payment", paySchema);