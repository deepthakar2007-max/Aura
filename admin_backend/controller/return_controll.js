const returnModel = require("../model/return_model");

const notificationModel = require("mongoose").models.notification;

const notify = async (type, message) => {
    try {
        if (notificationModel) await notificationModel.create({ type, message });
    } catch (error) {
        console.log("Notification failed:", error.message);
    }
};

const getAllReturns = async (req, res) => {
    try {
        const returns = await returnModel.find().populate("user", "username email").populate("order", "totalPrice").sort({ createdAt: -1 });
        res.json({ success: true, data: returns });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateReturnStatus = async (req, res) => {
    try {
        const ret = await returnModel.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        if (!ret) return res.status(404).json({ success: false, message: "Not found" });

        await notify("return", `Return request status updated to "${req.body.status}".`);

        res.json({ success: true, data: ret });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllReturns, updateReturnStatus };