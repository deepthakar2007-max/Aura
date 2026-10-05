const express = require("express");
const { getPublicBanners } = require("../controller/banner_controll");

const router = express.Router();
router.get("/", getPublicBanners);

module.exports = router;