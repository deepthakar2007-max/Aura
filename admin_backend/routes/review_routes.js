const express = require("express");
const { getAllReviews, deleteReview } = require("../controller/review_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAllReviews);
router.delete("/:id", auth, admin, deleteReview);

module.exports = router;