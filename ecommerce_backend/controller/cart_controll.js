const cartModel = require("../model/cart_model");

const getcart = async (req, res) => {
  try {
    const items = await cartModel.find({ user: req.user.userid }).populate("product");
    res.json({ success: true, data: { items } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addtocart = async (req, res) => {
  try {
    const { product, quantity = 1 } = req.body;
    if (!product) return res.status(400).json({ success: false, message: "Product is required" });
    const item = await cartModel.findOneAndUpdate(
      { user: req.user.userid, product, saved: false },
      { $inc: { quantity: Number(quantity) } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatecart = async (req, res) => {
  try {
    const item = await cartModel.findOneAndUpdate(
      { user: req.user.userid, $or: [{ _id: req.params.id }, { product: req.params.id }] },
      { quantity: Math.max(1, Number(req.body.quantity)) },
      { new: true },
    );
    if (!item) return res.status(404).json({ success: false, message: "Cart item not found" });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const togglesave = async (req, res) => {
  try {
    const item = await cartModel.findOne({ _id: req.params.id, user: req.user.userid });
    if (!item) return res.status(404).json({ success: false, message: "Cart item not found" });
    item.saved = !item.saved;
    await item.save();
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removecart = async (req, res) => {
  try {
    const item = await cartModel.findOneAndDelete({
      user: req.user.userid,
      $or: [{ _id: req.params.id }, { product: req.params.id }],
    });
    if (!item) return res.status(404).json({ success: false, message: "Cart item not found" });
    res.json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const clearcart = async (req, res) => {
  try {
    await cartModel.deleteMany({ user: req.user.userid, saved: false });
    res.json({ success: true, data: { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getcart, addtocart, updatecart, togglesave, removecart, clearcart };