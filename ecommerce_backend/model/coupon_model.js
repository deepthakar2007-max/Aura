const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discount: {
      type: Number,
      required: true,
    },

    discountType: {
      type: String,
      required: true,
      enum: ["FIXED", "PERCENTAGE"],
    },

    minimumOrderAmount: {
      type: Number,
      default: 0,
    },

    expiryDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
  },
  {
    timestamps: true,
  }
);

const couponModel = mongoose.model("coupon", couponSchema);

module.exports = couponModel;