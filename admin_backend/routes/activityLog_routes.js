const express = require("express");
const { getLogs } = require("../controller/activityLog_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getLogs);

module.exports = router;