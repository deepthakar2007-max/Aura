const activityLogModel = require("../model/activityLog_model");

const getLogs = async (req, res) => {
    try {
        const logs = await activityLogModel.find().populate("admin", "username").sort({ createdAt: -1 }).limit(100);
        res.json({ success: true, data: logs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getLogs };