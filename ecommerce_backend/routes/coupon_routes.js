const express = require("express");

const {
  addcoupon,
  updatecoupon,
  deletecoupon,
  getcouponById,
  getcoupons,
} = require("./../controller/coupon_controll.js");

const auth = require("./../middleware/auth.js");

const router = express.Router();

router.post("/", auth, addcoupon);

router.get("/", getcoupons);

router.get("/:id", getcouponById);

router.put("/:id", auth, updatecoupon);

router.delete("/:id", auth, deletecoupon);

module.exports = router;