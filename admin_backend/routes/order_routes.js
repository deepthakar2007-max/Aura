const express = require("express");
const { getAllOrders, getOrderById, updateOrderStatus } = require("../controller/order_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAllOrders);
router.get("/:id", auth, admin, getOrderById);
router.put("/:id", auth, admin, updateOrderStatus);

module.exports = router;