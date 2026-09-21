const express = require("express");

const {
  createpayment,
  getpayment,
  getpayments,
} = require("./../controller/payment_controll.js");

const auth = require("./../middleware/auth.js");

const router = express.Router();

router.post("/", auth, createpayment);

router.get("/:id", auth, getpayment);

router.get("/", auth, getpayments);

module.exports = router;