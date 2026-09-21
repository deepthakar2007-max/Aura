const orderModel = require("../model/order_model");

const placeOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, itemsPrice, shippingPrice, totalPrice } = req.body;
    if (!orderItems?.length || !shippingAddress || totalPrice === undefined) {
      return res.status(400).json({ success: false, message: "Order details are incomplete" });
    }
    const order = await orderModel.create({
      ...req.body,
      user: req.user.userid,
      itemsPrice: itemsPrice ?? 0,
      shippingPrice: shippingPrice ?? 0,
      totalPrice,
    });
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.userid };
    const orders = await orderModel.find(filter).populate("user").sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOrder = async (req, res) => {
  try {
    const filter = req.user.role === "admin"
      ? { _id: req.params.id }
      : { _id: req.params.id, user: req.user.userid };
    const order = await orderModel.findOne(filter).populate("user");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { orderstatus: req.body.orderstatus },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const cancelOrder = async (req, res) => {
  try {
    const order = await orderModel.findByIdAndUpdate(
      req.params.id,
      { orderstatus: "Cancelled" },
      { new: true, runValidators: true },
    );
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = { placeOrder, updateOrder, cancelOrder, getOrder, getOrders };
