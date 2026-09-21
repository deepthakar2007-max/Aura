const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    img: {
      type: String,
      default: "https://via.placeholder.com/400",
    },

    category: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("product", productSchema);

module.exports = productModel;