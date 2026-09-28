const notificationModel = require("../model/notification_model");

const getNotifications = async (req, res) => {
    try {
        const notifications = await notificationModel.find().sort({ createdAt: -1 }).limit(50);
        const unreadCount = await notificationModel.countDocuments({ read: false });
        res.json({ success: true, data: notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        await notificationModel.findByIdAndUpdate(req.params.id, { read: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const markAllRead = async (req, res) => {
    try {
        await notificationModel.updateMany({ read: false }, { read: true });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getNotifications, markAsRead, markAllRead };