const mongoose = require("mongoose");

const paySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    paymethod: {
      type: String,
      required: true,
      enum: ["COD", "UPI"],
    },

    paystatus: {
      type: String,
      enum: ["success", "pending", "failed", "refunded"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const payModel = mongoose.model("payment", paySchema);

module.exports = payModel;