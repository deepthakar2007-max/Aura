const reviewModel = require("../model/review_model");

const getAllReviews = async (req, res) => {
    try {
        const reviews = await reviewModel.find().populate("user", "username").populate("product", "name").sort({ createdAt: -1 });
        res.json({ success: true, data: reviews });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteReview = async (req, res) => {
    try {
        const review = await reviewModel.findByIdAndDelete(req.params.id);
        if (!review) return res.status(404).json({ success: false, message: "Not found" });
        res.json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getAllReviews, deleteReview };