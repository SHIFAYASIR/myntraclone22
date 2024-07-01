const express = require("express");
const { protect } = require("../../middleware/auth.middleware.js");
const orderController = require("../../controller/V1/order.controller.js");
const router = express.Router();

router.route("/")
  .post(protect, orderController.placeOrder)
  .get(protect, orderController.getUserOrders);
  

module.exports = router;
