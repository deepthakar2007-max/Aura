const express = require("express");
const { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } = require("../controller/coupon_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAllCoupons);
router.post("/", auth, admin, createCoupon);
router.put("/:id", auth, admin, updateCoupon);
router.delete("/:id", auth, admin, deleteCoupon);

module.exports = router;