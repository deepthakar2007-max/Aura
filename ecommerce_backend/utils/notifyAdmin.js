const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        type: { type: String, enum: ["order", "customer", "stock", "review", "return", "payment"], required: true },
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const notificationModel = mongoose.models.notification || mongoose.model("notification", notificationSchema);

const notifyAdmin = async (type, message) => {
    try {
        await notificationModel.create({ type, message });
    } catch (error) {
        console.log("Notification creation failed:", error.message);
    }
};

module.exports = notifyAdmin;