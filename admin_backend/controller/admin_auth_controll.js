const userModel = require("../model/user_model");
const adminUserModel = require("../model/adminUser_model");
const otpModel = require("../model/otp_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/mailer");
const logActivity = require("../utils/logActivity");

const adminRegister = async (req, res) => {
    try {
        const { username, email, password, adminRole, secretCode } = req.body;

        if (!username || !email || !password || !adminRole || !secretCode) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        console.log(process.env.ADMIN_SECRET_CODE);
        
        if (secretCode != process.env.ADMIN_SECRET_CODE) {
            return res.status(403).json({ success: false, message: "Invalid secret code" });
        }

        const upperEmail = email.trim().toUpperCase();
        const exists = await userModel.findOne({ email: upperEmail });
        if (exists) return res.status(409).json({ success: false, message: "Email already registered" });

        const hashed = await bcrypt.hash(password, 10);
        const user = await userModel.create({ username, email: upperEmail, password: hashed, role: "admin" });
        await adminUserModel.create({ user: user._id, adminRole });

        res.status(201).json({ success: true, message: "Admin account created. You can now login." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });

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

const sendResetOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required" });

        const upperEmail = email.trim().toUpperCase();
        const user = await userModel.findOne({ email: upperEmail, role: "admin" });
        if (!user) return res.status(404).json({ success: false, message: "No admin account with this email" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await otpModel.deleteMany({ email: upperEmail });
        await otpModel.create({ email: upperEmail, otp, expiresAt });
        await sendOtpEmail(email, otp, "reset");

        res.json({ success: true, message: "OTP sent to your email" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: "Email, OTP and new password required" });
        }
        const upperEmail = email.trim().toUpperCase();
        const record = await otpModel.findOne({ email: upperEmail, otp });
        if (!record) return res.status(400).json({ success: false, message: "Invalid OTP" });
        if (record.expiresAt < new Date()) {
            await otpModel.deleteOne({ _id: record._id });
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        const user = await userModel.findOne({ email: upperEmail });
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await otpModel.deleteOne({ _id: record._id });

        res.json({ success: true, message: "Password reset successfully" });
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

module.exports = {
    adminRegister, adminLogin, sendResetOtp, resetPassword,
    getAdminProfile, updateAdminProfile, changePassword,
};