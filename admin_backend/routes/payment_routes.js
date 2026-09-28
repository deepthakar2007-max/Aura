const express = require("express");
const { getAllPayments } = require("../controller/payment_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAllPayments);

module.exports = router;