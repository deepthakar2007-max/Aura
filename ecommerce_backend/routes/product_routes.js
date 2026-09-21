const express = require("express");
const {
  createproduct,
  updateproduct,
  deleteproduct,
  getsingleproduct,
  getmultipleproduct,
} = require("./../controller/product_controll");

const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/product/:id", getsingleproduct);

router.get("/product", getmultipleproduct);

router.post("/product", auth, admin, createproduct);

router.put("/product/:id", auth, admin, updateproduct);

router.delete("/product/:id", auth, admin, deleteproduct);

module.exports = router;