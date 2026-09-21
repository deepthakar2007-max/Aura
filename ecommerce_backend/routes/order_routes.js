const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  placeOrder,
  updateOrder,
  cancelOrder,
  getOrder,
  getOrders,
} = require("../controller/order_controll");

const router = express.Router();

router.get("/order", auth, getOrders);
router.get("/order/:id", auth, getOrder);
router.post("/order", auth, placeOrder);
router.put("/order/:id", auth, admin, updateOrder);
router.delete("/order/:id", auth, cancelOrder);

module.exports = router;
