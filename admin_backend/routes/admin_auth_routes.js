const express = require("express");
const { adminLogin, getAdminProfile, updateAdminProfile, changePassword } = require("../controller/admin_auth_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.post("/login", adminLogin);
router.get("/profile", auth, admin, getAdminProfile);
router.put("/profile", auth, admin, updateAdminProfile);
router.put("/change-password", auth, admin, changePassword);

module.exports = router;