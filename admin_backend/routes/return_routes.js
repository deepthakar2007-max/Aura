const express = require("express");
const { getAllReturns, updateReturnStatus } = require("../controller/return_controll");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();
router.get("/", auth, admin, getAllReturns);
router.put("/:id", auth, admin, updateReturnStatus);

module.exports = router;