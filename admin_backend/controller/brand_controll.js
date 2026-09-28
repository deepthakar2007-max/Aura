const brandModel = require("../model/brand_model");
const productModel = require("../model/product_model");

const getAllBrands = async (req, res) => {
    try {
        const brands = await brandModel.find().sort({ createdAt: -1 });
        const withCounts = await Promise.all(
            brands.map(async (b) => {
                const count = await productModel.countDocuments({ brand: b.name });
                return { ...b.toObject(), productCount: count };
            })
        );
        res.json({ success: true, data: withCounts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createBrand = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ success: false, message: "Name is required" });
        const exists = await brandModel.findOne({ name });
        if (exists) return res.status(409).json({ success: false, message: "Brand already exists" });
        const brand = await brandModel.create(req.body);
        res.status(201).json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateBrand = async (req, res) => {
    try {
        const brand = await brandModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!brand) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: brand });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteBrand = async (req, res) => {
    try {
        const brand = await brandModel.findByIdAndDelete(req.params.id);
        if (!brand) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllBrands, createBrand, updateBrand, deleteBrand };