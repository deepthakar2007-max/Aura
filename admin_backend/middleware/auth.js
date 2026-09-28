const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) return res.status(401).json({ success: false, message: "Token required" });
    if (token.startsWith("Bearer ")) token = token.split(" ")[1];

    try {
        req.user = jwt.verify(token, process.env.KEY);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid token" });
    }
};

module.exports = auth;