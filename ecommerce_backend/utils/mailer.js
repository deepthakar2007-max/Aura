const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass || user === "youremail@gmail.com" || pass === "your16digitapppassword") {
        throw new Error("Email service is not configured");
    }

    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: { user, pass: pass.replace(/\s/g, "") },
            connectionTimeout: 10000,
            greetingTimeout: 10000,
            socketTimeout: 15000,
        });
    }
    return transporter;
};

const sendOtpEmail = async (to, otp) => {
    await getTransporter().sendMail({
        from: `"AURA" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your AURA password reset code",
        html: `
      <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;padding:24px;border:1px solid #eee">
        <h2 style="letter-spacing:4px;margin:0 0 16px">AURA</h2>
        <p style="color:#444">Use this code to reset your password:</p>
        <p style="font-size:34px;letter-spacing:10px;font-weight:bold;margin:16px 0">${otp}</p>
        <p style="color:#888;font-size:13px">This code expires in 10 minutes. If you didn't request it, you can ignore this email.</p>
      </div>`,
    });
};

module.exports = sendOtpEmail;