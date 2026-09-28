const express = require("express");
const { getNotifications, markAsRead, markAllRead } = require("../controller/notification_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getNotifications);
router.put("/:id/read", auth, admin, markAsRead);
router.put("/read-all", auth, admin, markAllRead);

module.exports = router;