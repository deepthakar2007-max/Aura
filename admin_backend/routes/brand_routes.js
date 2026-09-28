const express = require("express");
const { getAllBrands, createBrand, updateBrand, deleteBrand } = require("../controller/brand_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAllBrands);
router.post("/", auth, admin, createBrand);
router.put("/:id", auth, admin, updateBrand);
router.delete("/:id", auth, admin, deleteBrand);

module.exports = router;