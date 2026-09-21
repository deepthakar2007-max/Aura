const reviewModel = require("./../model/review_model");

const addreview = async (req, res) => {
  try {
    let data = req.body;

    if (!data.user) {
      return res.status(400).json({
        success: false,
        message: "User is required",
      });
    }

    if (!data.product) {
      return res.status(400).json({
        success: false,
        message: "Product is required",
      });
    }

    if (!data.review) {
      return res.status(400).json({
        success: false,
        message: "Review is required",
      });
    }

    if (data.rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    let response = await reviewModel.create(data);

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatereview = async (req, res) => {
  try {
    let response = await reviewModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletereview = async (req, res) => {
  try {
    let response = await reviewModel.findByIdAndDelete(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: response,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getreviewbyid = async (req, res) => {
  try {
    let response = await reviewModel.findById(req.params.id);

    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
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
const getreviews = async (req, res) => {
  try {
    let data = req.query;
    let response = await reviewModel.find(data).populate("user", "username").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: response.length, data: response });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  addreview,
  updatereview,
  deletereview,
  getreviewbyid,
  getreviews,
};