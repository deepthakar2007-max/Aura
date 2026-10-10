require("dotenv").config();
const sendOtpEmail = require("./utils/mailer");

const to = process.argv[2] || process.env.EMAIL_USER;

sendOtpEmail(to, "123456")
    .then(() => console.log("✅ Mail sent to", to))
    .catch((err) => console.log("❌ Mail failed:", err.message));