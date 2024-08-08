const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const resultHelper = require("../../utils/result.helper");

// Add Product
const addProduct = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, description, thumnailImage, mrp, sellingPrice, brandName, categoryId, stock, extraImages } = req.body;

    if (!name || !mrp || !sellingPrice || !brandName) {
      return res.status(400).json({
        status: 0,
        msg: "Required fields are missing",
      });
    }

    const product = {
      userId,
      name,
      description,
      thumnailImage,
      mrp,
      sellingPrice,
      brandName,
      categoryId,
      stock,
      extraImages: extraImages || '' // Default to empty string if not provided
    };

    const newProduct = sqlHelper.fetchParams(product);

    const result = await sqlHelper.execute('sp_AddProductWithImage', newProduct);
    resultHelper.createStatus(result, res);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product.",
      error: error.message,
    });
  }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  try {
    // Extract user information from request
    const userType = req.user.userType;
    const userId = req.user.id;

    // Combine req.body with userId and userType
    const product = { ...req.body, userId, userType };

    // Log the product object for debugging
    console.log("Updated Product:", product);

    // Fetch and process parameters using your helper function
    const newProduct = sqlHelper.fetchParams(product);

     console.log(req.body.mrp)
  
       

    // Execute stored procedure to update the product
    const result = await sqlHelper.execute('sp_UpdateProduct', newProduct);

    // Send response based on the result
    resultHelper.mutationStatus(result, res);
  } catch (error) {
    // Send error response if something goes wrong
    res.status(500).json({ message: error.message });
  }
});


// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = parseInt(req.params.id);
  const userType = req.user.userType;
  const userId = req.user.id;

  try {
    const params = [
      { name: "productId", value: productId },
      { name: "userType", value: userType },
      { name: "userId", value: userId }
    ];
    const result = await sqlHelper.execute('[sp_DeleteProduct]', params);
    resultHelper.mutationStatus(result, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Products (Public)
const getAllProducts = asyncHandler(async (req, res) => {
  const { id, userType } = req.user; // Assuming user info is in req.user

  try {
    const params = [
      { name: 'userId', value: id },
      { name: 'userType', value: userType }
    ];
   
    
    const result = await sqlHelper.execute('sp_GetProducts', params);
    resultHelper.getStatus(result, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userType, id: userId } = req.user;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Please mention the product ID." });
  }

  try {
    const params = [
      { name: "id", value: id },
      { name: "userType", value: userType },
      { name: "userId", value: userId }
    ];
    const result = await sqlHelper.execute('[sp_GetProductById]', params);
    resultHelper.getStatusById(result, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
    
  }
});
module.exports = {
  addProduct,
  updateProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
};
