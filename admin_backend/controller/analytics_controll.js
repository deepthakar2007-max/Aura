const orderModel = require("../model/order_model");
const productModel = require("../model/product_model");
const userModel = require("../model/user_model");

const getAnalytics = async (req, res) => {
    try {
        const orders = await orderModel.find();
        const products = await productModel.find();
        const users = await userModel.find({ role: "user" });

        const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders ? totalRevenue / totalOrders : 0;

        const revenueByDay = {};
        orders.forEach((o) => {
            const day = new Date(o.createdAt).toLocaleDateString("en-IN");
            revenueByDay[day] = (revenueByDay[day] || 0) + o.totalPrice;
        });

        const salesByCategory = {};
        orders.forEach((o) => {
            o.orderItems.forEach((item) => {
                const product = products.find((p) => p._id.toString() === item.product?.toString());
                const cat = product?.category || "unknown";
                salesByCategory[cat] = (salesByCategory[cat] || 0) + item.price * item.quantity;
            });
        });

        const productSales = {};
        orders.forEach((o) => {
            o.orderItems.forEach((item) => {
                productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
            });
        });
        const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

        res.json({
            success: true,
            data: {
                totalRevenue, totalOrders, avgOrderValue,
                totalCustomers: users.length,
                revenueByDay, salesByCategory, topProducts,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAnalytics };