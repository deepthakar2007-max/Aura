const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
    {
        admin: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        action: { type: String, required: true },
        module: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("activity_log", activityLogSchema);