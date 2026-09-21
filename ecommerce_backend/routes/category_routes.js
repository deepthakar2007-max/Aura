const express = require("express");

const {
  addcategory,
  updatecategory,
  deletecategory,
  getcategorybyid,
  getCategories,
} = require("./../controller/category_controll.js");

const auth = require("./../middleware/auth.js");
const admin = require("./../middleware/admin.js");

const router = express.Router();

router.get("/:id", getcategorybyid);

router.get("/", getCategories);

router.post("/", auth, admin, addcategory);

router.put("/:id", auth, admin, updatecategory);

router.delete("/:id", auth, admin, deletecategory);

module.exports = router;