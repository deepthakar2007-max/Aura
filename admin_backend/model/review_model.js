const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
        review: String,
        rating: Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model("review_rating", reviewSchema);