const userModel = require("../model/user_model");

const getAllCustomers = async (req, res) => {
    try {
        const users = await userModel.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getCustomerById = async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id).select("-password");
        if (!user) return res.status(404).json({ success: false, message: "Customer not found" });
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllCustomers, getCustomerById };