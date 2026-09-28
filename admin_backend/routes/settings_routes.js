const express = require("express");
const { getSettings, updateSettings } = require("../controller/settings_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getSettings);
router.put("/", auth, admin, updateSettings);

module.exports = router;