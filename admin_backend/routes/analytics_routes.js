const express = require("express");
const { getAnalytics } = require("../controller/analytics_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAnalytics);

module.exports = router;