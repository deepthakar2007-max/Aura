const productModel = require("./../model/product_model");
const orderModel = require("./../model/order_model");
const notifyAdmin = require("../utils/notifyAdmin");

const createproduct = async (req, res) => {
  try {
    let data = req.body;

    if (!data.name) return res.status(400).json({ success: false, message: "Name is required" });
    if (!data.price) return res.status(400).json({ success: false, message: "Price is required" });
    if (!data.category) return res.status(400).json({ success: false, message: "Category is required" });
    if (data.stock === undefined) return res.status(400).json({ success: false, message: "Stock is required" });

    let response = await productModel.create(data);
    res.status(201).json({ success: true, message: "Product added successfully", data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateproduct = async (req, res) => {
  try {
    let response = await productModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!response) return res.status(404).json({ success: false, message: "Product not found" });

    if (response.stock > 0 && response.stock <= 5) {
      await notifyAdmin("stock", `Low stock alert: "${response.name}" has only ${response.stock} units left.`);
    }

    res.status(200).json({ success: true, message: "Product updated successfully", data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteproduct = async (req, res) => {
  try {
    let response = await productModel.findByIdAndDelete(req.params.id);
    if (!response) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product deleted successfully", data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getsingleproduct = async (req, res) => {
  try {
    let response = await productModel.findById(req.params.id);
    if (!response) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getmultipleproduct = async (req, res) => {
  try {
    let data = req.query;
    let response = await productModel.find(data);
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getbestsellers = async (req, res) => {
  try {
    const sales = await orderModel.aggregate([
      { $match: { orderstatus: { $ne: "Cancelled" } } },
      { $unwind: "$orderItems" },
      { $group: { _id: "$orderItems.product", sold: { $sum: "$orderItems.quantity" } } },
      { $sort: { sold: -1 } },
      { $limit: 8 },
    ]);

    let products = [];
    if (sales.length) {
      const ids = sales.map((s) => s._id);
      const found = await productModel.find({ _id: { $in: ids } });
      products = ids.map((id) => found.find((p) => p._id.equals(id))).filter(Boolean);
    }

    if (products.length < 4) {
      const existingIds = products.map((p) => p._id);
      const extra = await productModel
        .find({ _id: { $nin: existingIds }, stock: { $gt: 0 } })
        .sort({ createdAt: -1 })
        .limit(8 - products.length);
      products = [...products, ...extra];
    }

    res.status(200).json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createproduct,
  updateproduct,
  deleteproduct,
  getsingleproduct,
  getmultipleproduct,
  getbestsellers,
};