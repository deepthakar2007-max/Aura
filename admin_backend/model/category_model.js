const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        img: { type: String, default: "https://via.placeholder.com/150" },
        description: { type: String, default: "" },
        tagline: { type: String, default: "" },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("category", categorySchema);