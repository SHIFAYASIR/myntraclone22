const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const resultHelper = require("../../utils/result.helper");
const bodyParser = require("body-parser");

// Add Item to Cart
const addItemToCart = asyncHandler(async (req, res) => {
  try {
    const { Quantity, ProductId } = req.body;
    console.log(req.user)
    const userId = parseInt(req.user.recordset[0].Id);

    if (Quantity && ProductId && userId) {
      const params = [
        { name: "quantity", value: Quantity },
        { name: "productId", value: ProductId }, 
        { name: "userId", value: userId }
      ];

      const result = await sqlHelper.execute('sp_AddItemToCart', params);
      console.log(result);
      res.status(200).json({ message: result.recordset[0].MSG });
    } else {
      res.status(404).json({
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});   

// Get Cart Items
const getCartItems = asyncHandler(async (req, res) => {
  try {
    const userId = parseInt(req.user.recordset[0].Id);
    const result = await sqlHelper.execute('GetCartUserItems', [{ name: 'userId', value: userId }]);
    resultHelper.getStatus(result, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove Cart Item
const removeCartItem = asyncHandler(async (req, res) => {
  console.log(req.body)
  try {
    const userId = parseInt(req.user.recordset[0].Id);
   
    const {productId} = req.body;
    console.log(userId,productId)
    if (productId && userId) {
      const params=[
        { name: "productId", value: productId },
         { name: "userId", value: userId }

      ];
      
      
      const updateResult = await sqlHelper.execute("[sp_RemoveCartItem]",params);

      res.status(200).json({ message: updateResult.recordset[0].MSG });
    } else { 
      res.status(404).json({
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});


// Update Cart Item Quantity ---  @UserId INT,
  // @ProductId INT,
   // @Quantity INT
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  console.log(req.body)
  try {
    const { ProductId,Quantity} = req.body;
    const userId = parseInt(req.user.recordset[0].Id);
    console.log(ProductId,Quantity,userId)
    if (ProductId && Quantity && userId ) {
      const params = [
        { name: "ProductId", value: ProductId },
        { name: "Quantity", value: Quantity },
        { name: "userId", value: userId }
      ];

      const result = await sqlHelper.execute("sp_UpdateCart", params);
      res.status(200).json({ message: result.recordset[0].MSG });
    } else {
      res.status(400).json({ message: "Invalid parameters provided." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = {
  addItemToCart,
  getCartItems,
  removeCartItem,
  updateCartItemQuantity,
 
};
