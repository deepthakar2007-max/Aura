const addressModel = require("../model/address_model");

const addAddress = async (req, res) => {
  try {
    let data = req.body;

    if (!data.user) {
      return res.status(400).json({
        success: false,
        message: "User is required",
      });
    }

    if (!data.fullname) {
      return res.status(400).json({
        success: false,
        message: "Full name is required",
      });
    }

    if (!data.mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    if (!data.address) {
      return res.status(400).json({
        success: false,
        message: "Address is required",
      });
    }

    if (!data.city) {
      return res.status(400).json({
        success: false,
        message: "City is required",
      });
    }

    if (!data.state) {
      return res.status(400).json({
        success: false,
        message: "State is required",
      });
    }

    if (!data.pincode) {
      return res.status(400).json({
        success: false,
        message: "Pincode is required",
      });
    }

    let response = await addressModel.create(data);

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAddress = async (req, res) => {
  try {
    let response = await addressModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAddress = async (req, res) => {
  try {
    let response = await addressModel.findByIdAndDelete(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAddressById = async (req, res) => {
  try {
    let response = await addressModel.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
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

const getAddresses = async (req, res) => {
  try {
    let data = req.query;

    let response = await addressModel.find(data);

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
  addAddress,
  updateAddress,
  deleteAddress,
  getAddressById,
  getAddresses,
};