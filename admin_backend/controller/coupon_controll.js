const couponModel = require("../model/coupon_model");

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await couponModel.find().sort({ createdAt: -1 });
        res.json({ success: true, data: coupons });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const createCoupon = async (req, res) => {
    try {
        const { code, discount, discountType, expiryDate } = req.body;
        if (!code || !discount || !discountType || !expiryDate) {
            return res.status(400).json({ success: false, message: "Code, discount, discountType, expiryDate required" });
        }
        const exists = await couponModel.findOne({ code: code.toUpperCase() });
        if (exists) return res.status(409).json({ success: false, message: "Coupon already exists" });
        const coupon = await couponModel.create(req.body);
        res.status(201).json({ success: true, data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateCoupon = async (req, res) => {
    try {
        const coupon = await couponModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, data: coupon });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const coupon = await couponModel.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllCoupons, createCoupon, updateCoupon, deleteCoupon };