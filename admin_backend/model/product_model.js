const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, default: "" },
        img: { type: String, default: "" },
        images: { type: [String], default: [] },
        category: { type: String, required: true },
        brand: { type: String, default: "" },
        stock: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("product", productSchema);