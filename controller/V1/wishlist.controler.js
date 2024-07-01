const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");

// Add Item to Wishlist
const addItemToWishlist = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = parseInt(req.user.recordset[0].Id);

    if (productId) {
      const params = [
        { name: "userId", value: userId },
        { name: "productId", value: productId }
      ];

      const result = await sqlHelper.execute("sp_AddToWishlist", params);
      res.status(200).json({ message: result.recordset[0].MSG });
    } else {
      res.status(400).json({
        message: "Product ID is required",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Remove Item from Wishlist
const removeItemFromWishlist = asyncHandler(async (req, res) => {
  try {
    const { id: productId } = req.params;
    const userId = parseInt(req.user.recordset[0].Id);

    if (productId) {
      const params = [
        { name: "userId", value: userId },
        { name: "productId", value: productId }
      ];

      const result = await sqlHelper.execute("sp_RemoveItemFromWishlist", params);
      res.status(200).json({ message: result.recordset[0].MSG });
    } else {
      res.status(400).json({
        message: "Product ID is required",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Wishlist Items for User
const getWishlistItems = asyncHandler(async (req, res) => {
  try {
    const userId = parseInt(req.user.recordset[0].Id);
    console.log(userID)

    const params = [
      { name: "userId", value: userId }
    ];

    const result = await sqlHelper.execute("sp_GetWishlistItems", params);

    if (result.recordset.length > 0 && result.recordset[0].status !== 0) {
      res.status(200).json(result.recordset);
    } else {
      res.status(404).json({ message: "Wishlist not found or is empty" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Add Wishlist Item to Cart
const addWishlistItemToCart = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = parseInt(req.user.recordset[0].Id);

    if (productId) {
      const params = [
        { name: "userId", value: userId },
        { name: "productId", value: productId }
      ];

      const result = await sqlHelper.execute("sp_AddWishlistItemToCart", params);
      res.status(200).json({ message: result.recordset[0].msg });
    } else {
      res.status(400).json({
        message: "Product ID is required",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = {
  addItemToWishlist,
  removeItemFromWishlist,
  getWishlistItems,
  addWishlistItemToCart
};
