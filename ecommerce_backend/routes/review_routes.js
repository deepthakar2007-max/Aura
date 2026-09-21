const express = require("express");

const {
  getreviews,
  getreviewbyid,
  deletereview,
  updatereview,
  addreview,
} = require("./../controller/review_contoll.js");

const auth = require("./../middleware/auth.js");

const router = express.Router();

router.get("/:id", getreviewbyid);

router.get("/", getreviews);

router.post("/", auth, addreview);

router.put("/:id", auth, updatereview);

router.delete("/:id", auth, deletereview);

module.exports = router;