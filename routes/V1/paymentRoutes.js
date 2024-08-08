// routes/paymentRoutes.js
const express = require("express");
const { protect } = require("../../middleware/auth.middleware.js");
const paymetnController = require("../../controller/V1/paymentController.js");
const router = express.Router();



router.route('/create-order')
.post( protect,paymetnController.createOrder);
router.route('/verify-payment')
.post(protect,paymetnController.verifyPayment);






module.exports = router;
