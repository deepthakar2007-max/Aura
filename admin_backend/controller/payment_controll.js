const payModel = require("../model/payment_model");

const getAllPayments = async (req, res) => {
    try {
        const payments = await payModel.find().populate("user", "username email").populate("order", "totalPrice").sort({ createdAt: -1 });
        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllPayments };