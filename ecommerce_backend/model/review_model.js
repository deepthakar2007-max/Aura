const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
      required: true,
    },

    review: {
      type: String,
    },

    rating: {
      type: Number,
      maxlength: 5,
    },
  },
  {
    timestamps: true,
  }
);

const reviewModel = mongoose.model("review_rating", reviewSchema);

module.exports = reviewModel;