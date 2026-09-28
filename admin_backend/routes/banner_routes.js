const express = require("express");
const { getAllBanners, createBanner, updateBanner, deleteBanner } = require("../controller/banner_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAllBanners);
router.post("/", auth, admin, createBanner);
router.put("/:id", auth, admin, updateBanner);
router.delete("/:id", auth, admin, deleteBanner);

module.exports = router;