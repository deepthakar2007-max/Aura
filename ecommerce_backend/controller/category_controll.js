const categoryModel = require("./../model/category_model");

const addcategory = async (req, res) => {
  try {
    let data = req.body;

    if (!data.name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    let category = await categoryModel.findOne({ name: data.name });

    if (category) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    let response = await categoryModel.create(data);

    res.status(201).json({
      success: true,
      message: "Category added successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatecategory = async (req, res) => {
  try {
    let response = await categoryModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletecategory = async (req, res) => {
  try {
    let response = await categoryModel.findByIdAndDelete(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getcategorybyid = async (req, res) => {
  try {
    let response = await categoryModel.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
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

const getCategories = async (req, res) => {
  try {
    let data = req.query;

    let response = await categoryModel.find(data);

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
  addcategory,
  updatecategory,
  deletecategory,
  getcategorybyid,
  getCategories,
};