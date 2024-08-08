const express = require("express");
const { protect } = require("../../middleware/auth.middleware.js");
const cartController = require("../../controller/V1/cart.controller.js");
const router = express.Router();

router.route("/")
  .post( protect,cartController.addItemToCart)
  .get(protect,cartController.getCartItems)
  .put (protect,cartController.updateCartItemQuantity);

router.route("/:id")
  .delete(protect, cartController.removeCartItem)
  

module.exports = router;
