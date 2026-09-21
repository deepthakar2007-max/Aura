const express = require("express");

const {
  addwishlist,
  deletewishlist,
  getwishlistbyid,
  getwishlists,
} = require("./../controller/wishlist_controll.js");

const auth = require("./../middleware/auth.js");

const router = express.Router();

router.post("/", auth, addwishlist);

router.get("/", auth, getwishlists);

router.get("/:id", auth, getwishlistbyid);

router.delete("/:id", auth, deletewishlist);

module.exports = router;