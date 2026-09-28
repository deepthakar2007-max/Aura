const adminUserModel = require("../model/adminUser_model");
const userModel = require("../model/user_model");

const getAllAdminUsers = async (req, res) => {
    try {
        const admins = await adminUserModel.find().populate("user", "username email");
        res.json({ success: true, data: admins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createAdminUser = async (req, res) => {
    try {
        const { userId, adminRole, permissions } = req.body;
        if (!userId) return res.status(400).json({ success: false, message: "User ID required" });

        const targetUser = await userModel.findById(userId);
        if (!targetUser) return res.status(404).json({ success: false, message: "User not found" });

        targetUser.role = "admin";
        await targetUser.save();

        const exists = await adminUserModel.findOne({ user: userId });
        if (exists) return res.status(409).json({ success: false, message: "Already an admin" });

        const adminUser = await adminUserModel.create({ user: userId, adminRole, permissions });
        res.status(201).json({ success: true, data: adminUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAdminUser = async (req, res) => {
    try {
        const adminUser = await adminUserModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!adminUser) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: adminUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAdminUser = async (req, res) => {
    try {
        const adminUser = await adminUserModel.findById(req.params.id);
        if (!adminUser) return res.status(404).json({ success: false, message: "Not found" });

        await userModel.findByIdAndUpdate(adminUser.user, { role: "user" });
        await adminUserModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Removed admin access" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser };