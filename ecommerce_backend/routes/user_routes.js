const express = require("express");
const {
  register, login, forgotPassword, resetPassword, getUser, updateUser, deleteUser,
} = require("./../controller/user_controll.js");

const auth = require("./../middleware/auth.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/user", auth, getUser);
router.put("/user", auth, updateUser);
router.delete("/user", auth, deleteUser);

module.exports = router;