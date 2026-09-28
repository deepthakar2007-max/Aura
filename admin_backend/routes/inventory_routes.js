const express = require("express");
const { getInventory, adjustStock } = require("../controller/inventory_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getInventory);
router.put("/:id/adjust", auth, admin, adjustStock);

module.exports = router;