const userModel = require("../model/user_model");
const otpModel = require("../model/otp_model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../utils/mailer");

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });

    const upperEmail = email.trim().toUpperCase();
    const existingUser = await userModel.findOne({ email: upperEmail });
    if (existingUser) return res.status(409).json({ success: false, message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await otpModel.deleteMany({ email: upperEmail });
    await otpModel.create({ email: upperEmail, otp, expiresAt });

    await sendOtpEmail(email, otp);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: "Email and OTP required" });

    const upperEmail = email.trim().toUpperCase();
    const record = await otpModel.findOne({ email: upperEmail, otp });
    if (!record) return res.status(400).json({ success: false, message: "Invalid OTP" });
    if (record.expiresAt < new Date()) {
      await otpModel.deleteOne({ _id: record._id });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const register = async (req, res) => {
  try {
    let data = req.body;

    if (!data.username) return res.status(400).json({ success: false, message: "Username is required" });
    if (!data.email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!data.password) return res.status(400).json({ success: false, message: "Password is required" });
    if (!data.otp) return res.status(400).json({ success: false, message: "OTP is required" });

    const email = data.email.trim().toUpperCase();

    const otpRecord = await otpModel.findOne({ email, otp: data.otp });
    if (!otpRecord) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    if (otpRecord.expiresAt < new Date()) {
      await otpModel.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    let user = await userModel.findOne({ email });
    if (user) return res.status(409).json({ success: false, message: "User already exists" });

    let hashPassword = await bcrypt.hash(data.password, 10);
    let result = await userModel.create({ username: data.username, email, password: hashPassword });

    await otpModel.deleteOne({ _id: otpRecord._id });

    res.status(201).json({ success: true, message: "User registered successfully", data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    let data = req.body;
    if (!data.email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!data.password) return res.status(400).json({ success: false, message: "Password is required" });

    let user = await userModel.findOne({ email: data.email.trim().toUpperCase() });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let password = await bcrypt.compare(data.password, user.password);
    if (!password) return res.status(401).json({ success: false, message: "Invalid password" });

    let token = jwt.sign({ userid: user._id, role: user.role }, process.env.KEY);
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    let user = await userModel.findById(req.user.userid);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const allowedFields = ["username", "photo", "phone"];
    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    let user = await userModel.findByIdAndUpdate(req.user.userid, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    let user = await userModel.findByIdAndDelete(req.user.userid);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getUser, updateUser, deleteUser, sendOtp, verifyOtp };