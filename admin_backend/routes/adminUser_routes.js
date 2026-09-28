const express = require("express");
const { getAllAdminUsers, createAdminUser, updateAdminUser, deleteAdminUser } = require("../controller/adminUser_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAllAdminUsers);
router.post("/", auth, admin, createAdminUser);
router.put("/:id", auth, admin, updateAdminUser);
router.delete("/:id", auth, admin, deleteAdminUser);

module.exports = router;