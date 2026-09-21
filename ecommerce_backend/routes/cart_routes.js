const express = require("express");

const {
  addtocart,
  updatecart,
  togglesave,
  removecart,
  clearcart,
  getcart,
} = require("./../controller/cart_controll.js");

const auth = require("./../middleware/auth.js");

const router = express.Router();

router.get("/", auth, getcart);
router.post("/", auth, addtocart);
router.put("/:id", auth, updatecart);
router.put("/:id/save", auth, togglesave);
router.delete("/:id", auth, removecart);
router.delete("/", auth, clearcart);

module.exports = router;