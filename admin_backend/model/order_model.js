const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        name: String, quantity: Number, price: Number, img: String,
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        orderItems: [orderItemSchema],
        shippingAddress: mongoose.Schema.Types.Mixed,
        paymentMethod: String,
        itemsPrice: Number,
        shippingPrice: Number,
        totalPrice: Number,
        orderstatus: { type: String, enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);