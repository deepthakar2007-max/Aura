const express = require("express");
const { getAllCustomers, getCustomerById } = require("../controller/customer_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAllCustomers);
router.get("/:id", auth, admin, getCustomerById);

module.exports = router;