const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    quantity: {
      type: Number,
      default: 1,
    },
    saved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const cartModel = mongoose.model("cart", cartSchema);

module.exports = cartModel;