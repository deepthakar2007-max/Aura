const productModel = require("../model/product_model");

const getInventory = async (req, res) => {
    try {
        const products = await productModel.find().sort({ stock: 1 });
        res.json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const adjustStock = async (req, res) => {
    try {
        const { type, quantity } = req.body;
        if (!type || !quantity) {
            return res.status(400).json({ success: false, message: "Type (add/remove) and quantity required" });
        }
        const product = await productModel.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        if (type === "add") product.stock += Number(quantity);
        else if (type === "remove") product.stock = Math.max(0, product.stock - Number(quantity));
        else return res.status(400).json({ success: false, message: "Invalid type" });

        await product.save();
        res.json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getInventory, adjustStock };