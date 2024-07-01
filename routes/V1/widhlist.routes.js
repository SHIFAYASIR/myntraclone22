const express = require("express");
const { protect } = require("../../middleware/auth.middleware.js");
const wishlistController = require("../../controller/V1/wishlist.controler.js");
const router = express.Router();

// Add item to wishlist
router.route("/")
  .post(protect, wishlistController.addItemToWishlist)
  .get(protect, wishlistController.getWishlistItems)
  .post(protect, wishlistController.addWishlistItemToCart);

// Remove item from wishlist
router.route("/:id")
  .delete(protect, wishlistController.removeItemFromWishlist);




  

module.exports = router;
