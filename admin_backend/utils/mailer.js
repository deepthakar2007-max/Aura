const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendOtpEmail = async (email, otp, purpose) => {
    await transporter.sendMail({
        from: `"AURA Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: purpose === "reset" ? "Reset Your Admin Password" : "Verify Your Admin Email",
        html: `<p>Your OTP code is:</p><h2>${otp}</h2><p>Expires in 10 minutes.</p>`,
    });
};

module.exports = sendOtpEmail;