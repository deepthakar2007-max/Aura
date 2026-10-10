const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../model/user_model");
const otpModel = require("../model/otp_model");
const sendOtpEmail = require("../utils/mailer");
const notifyAdmin = require("../utils/notifyAdmin");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_GAP_MS = 60 * 1000;
const MAX_ATTEMPTS = 5;

const fail = (res, status, message, field) =>
  res.status(status).json({ success: false, message, ...(field ? { field } : {}) });

const hashOtp = (otp) => crypto.createHash("sha256").update(String(otp)).digest("hex");

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !username.trim()) return fail(res, 400, "Please enter your name", "username");
    if (!email || !email.trim()) return fail(res, 400, "Please enter your email", "email");
    if (!EMAIL_RE.test(email.trim())) return fail(res, 400, "Please enter a valid email address", "email");
    if (!password) return fail(res, 400, "Please create a password", "password");
    if (password.length < 6) return fail(res, 400, "Password must be at least 6 characters", "password");

    const upperEmail = email.trim().toUpperCase();
    const exists = await userModel.findOne({ email: upperEmail });
    if (exists) return fail(res, 409, "This email is already registered. Try signing in instead.", "email");

    const hash = await bcrypt.hash(password, 10);
    const user = await userModel.create({ username: username.trim(), email: upperEmail, password: hash });

    await notifyAdmin("customer", `${user.username} created a new customer account.`);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: { _id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) return fail(res, 400, "Please enter your email", "email");
    if (!EMAIL_RE.test(email.trim())) return fail(res, 400, "Please enter a valid email address", "email");
    if (!password) return fail(res, 400, "Please enter your password", "password");

    const user = await userModel.findOne({ email: email.trim().toUpperCase() });
    if (!user) return fail(res, 404, "This email is not registered. Please create an account.", "email");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return fail(res, 401, "Incorrect password. Try again or reset it.", "password");

    const token = jwt.sign({ userid: user._id, role: user.role }, process.env.KEY);
    res.status(200).json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) return fail(res, 400, "Please enter your email", "email");
    if (!EMAIL_RE.test(email.trim())) return fail(res, 400, "Please enter a valid email address", "email");

    const upperEmail = email.trim().toUpperCase();
    const user = await userModel.findOne({ email: upperEmail });
    if (!user) return fail(res, 404, "This email is not registered.", "email");

    const recent = await otpModel.findOne({ email: upperEmail }).sort({ createdAt: -1 });
    if (recent) {
      const wait = RESEND_GAP_MS - (Date.now() - new Date(recent.createdAt).getTime());
      if (wait > 0) {
        return fail(res, 429, `Please wait ${Math.ceil(wait / 1000)}s before requesting another code.`, "email");
      }
    }

    const otp = crypto.randomInt(100000, 1000000).toString();
    await otpModel.deleteMany({ email: upperEmail });
    await otpModel.create({ email: upperEmail, otp: hashOtp(otp), expiresAt: new Date(Date.now() + OTP_TTL_MS) });

    try {
      await sendOtpEmail(email.trim(), otp);
    } catch (mailError) {
      console.log("Mail error:", mailError.message);
      await otpModel.deleteMany({ email: upperEmail });
      return fail(res, 502, "We couldn't send the email right now. Please try again in a few minutes.");
    }

    res.json({ success: true, message: `We sent a 6-digit code to ${email.trim()}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !EMAIL_RE.test(email.trim())) return fail(res, 400, "Please enter a valid email address", "email");
    if (!otp || String(otp).length !== 6) return fail(res, 400, "Enter the 6-digit code from your email", "otp");
    if (!newPassword || newPassword.length < 6) {
      return fail(res, 400, "Password must be at least 6 characters", "newPassword");
    }

    const upperEmail = email.trim().toUpperCase();
    const record = await otpModel.findOne({ email: upperEmail });
    if (!record) return fail(res, 400, "Code expired or not requested. Please request a new one.", "otp");

    if (record.expiresAt < new Date()) {
      await otpModel.deleteOne({ _id: record._id });
      return fail(res, 400, "This code has expired. Please request a new one.", "otp");
    }

    if (record.otp !== hashOtp(otp)) {
      record.attempts += 1;
      if (record.attempts >= MAX_ATTEMPTS) {
        await otpModel.deleteOne({ _id: record._id });
        return fail(res, 429, "Too many wrong attempts. Please request a new code.", "otp");
      }
      await record.save();
      return fail(res, 400, `Incorrect code. ${MAX_ATTEMPTS - record.attempts} attempts left.`, "otp");
    }

    const user = await userModel.findOne({ email: upperEmail });
    if (!user) return fail(res, 404, "This email is not registered.", "email");

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await otpModel.deleteMany({ email: upperEmail });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userid).select("-password");
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
    const user = await userModel
      .findByIdAndUpdate(req.user.userid, updates, { new: true, runValidators: true })
      .select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.user.userid);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, forgotPassword, resetPassword, getUser, updateUser, deleteUser };