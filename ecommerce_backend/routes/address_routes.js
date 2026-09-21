const express = require("express");

const {
  addAddress,
  updateAddress,
  deleteAddress,
  getAddressById,
  getAddresses 
} = require("./../controller/address_controll");

const router = express.Router();

router.get("/address/:id", getAddressById);

router.get("/address", getAddresses);

router.post("/address", addAddress);

router.put("/address/:id", updateAddress);

router.delete("/address/:id", deleteAddress);

module.exports = router;