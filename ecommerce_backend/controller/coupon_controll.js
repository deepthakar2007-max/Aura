const couponModel = require("./../model/coupon_model");

const addcoupon = async (req, res) => {
  try {
    let data = req.body;

    if (!data.code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    if (!data.discount) {
      return res.status(400).json({
        success: false,
        message: "Discount is required",
      });
    }

    if (!data.discountType) {
      return res.status(400).json({
        success: false,
        message: "Discount type is required",
      });
    }

    if (!data.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Expiry date is required",
      });
    }

    let coupon = await couponModel.findOne({ code: data.code.toUpperCase() });

    if (coupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    let response = await couponModel.create(data);

    res.status(201).json({
      success: true,
      message: "Coupon added successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatecoupon = async (req, res) => {
  try {
    let response = await couponModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletecoupon = async (req, res) => {
  try {
    let response = await couponModel.findByIdAndDelete(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getcouponById = async (req, res) => {
  try {
    let response = await couponModel.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.status(200).json({
      success: true,
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getcoupons = async (req, res) => {
  try {
    let data = req.query;

    let response = await couponModel.find(data);

    res.status(200).json({
      success: true,
      count: response.length,
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addcoupon,
  updatecoupon,
  deletecoupon,
  getcouponById,
  getcoupons,
};