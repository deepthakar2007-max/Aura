const payModel = require("./../model/payment_model");

const createpayment = async (req, res) => {
  try {
    let data = req.body;

    if (!data.user) {
      return res.status(400).json({
        success: false,
        message: "User is required",
      });
    }

    if (!data.order) {
      return res.status(400).json({
        success: false,
        message: "Order is required",
      });
    }

    if (!data.amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    if (!data.paymethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required",
      });
    }

    let response = await payModel.create(data);

    res.status(201).json({
      success: true,
      message: "Payment created successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getpayment = async (req, res) => {
  try {
    let response = await payModel.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
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

const getpayments = async (req, res) => {
  try {
    let data = req.query;

    let response = await payModel.find(data);

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
  createpayment,
  getpayment,
  getpayments,
};