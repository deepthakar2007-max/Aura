const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        image: { type: String, required: true },
        link: { type: String, default: "" },
        position: { type: String, enum: ["hero", "promo", "featured"], default: "hero" },
        objectPosition: { type: String, default: "center" },
        order: { type: Number, default: 0 },
        status: { type: String, enum: ["active", "inactive"], default: "active" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("banner", bannerSchema);