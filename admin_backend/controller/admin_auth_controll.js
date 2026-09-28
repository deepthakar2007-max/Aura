const userModel = require("../model/user_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logActivity = require("../utils/logActivity");

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password required" });
        }
        const user = await userModel.findOne({ email: email.trim().toUpperCase() });
        if (!user) return res.status(404).json({ success: false, message: "Admin not found" });
        if (user.role !== "admin") return res.status(403).json({ success: false, message: "Not an admin account" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, message: "Invalid password" });

        const token = jwt.sign({ userid: user._id, role: user.role }, process.env.KEY);
        await logActivity(user._id, "Admin Login", "Auth");
        res.json({ success: true, message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getAdminProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userid);
        if (!user) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateAdminProfile = async (req, res) => {
    try {
        const allowed = ["username", "photo", "phone"];
        const updates = {};
        allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
        const user = await userModel.findByIdAndUpdate(req.user.userid, updates, { new: true, runValidators: true });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "Old and new password required" });
        }
        const user = await userModel.findById(req.user.userid);
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(401).json({ success: false, message: "Old password is incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { adminLogin, getAdminProfile, updateAdminProfile, changePassword };