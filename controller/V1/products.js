const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const resultHelper = require("../../utils/result.helper");

// Add Product
const addProduct = asyncHandler(async (req, res) => {
  try {
    console.log(req.user.id)
    const userId = parseInt(req.user.id);
    
    const { name, description, thumnailImage, mrp, extraImages, sellingPrice, brandName,CategoryId,stock } = req.body; 

    console.log(req.body)
     //const images = req.files.extname(file => file.filename);
    const params = [
      { name: "userId", value: userId },
      { name: "name", value: name },
      { name: "description", value: description },
      { name: "thumnailImage", value: thumnailImage },
      { name: "extraImages", value: extraImages },
      { name: "mrp", value: mrp },
      { name: "sellingPrice", value: sellingPrice },
      { name: "CategoryId", value: CategoryId },
      { name: "brandName", value: brandName },
      { name: "stock", value: stock },

    ];
    console.log("dwdbwdjb",params)

    const result = await sqlHelper.execute(`sp_AddProductWithImage`, params);
    resultHelper.createStatus(result, res);
    res.status(200).json({ message: result.recordset[0].msg });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add product.",
      error: error.message,
    });
  }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
  const userType = req.user.userType
  const { id,name,
     description, thumnailImage, extraImages, status, MRP, sellingPrice, categoryId, stock } = req.body;

  try {
    const params = [
      { name: 'userType', value: userType },
      { name: 'id', value: id },
      { name: 'name', value: name },
      { name: 'description', value: description },
      { name: 'thumnailImage', value: thumnailImage },
      { name: 'extraImages', value: extraImages },
      { name: 'status', value: status },
      { name: 'MRP', value: MRP },
      { name: 'sellingPrice', value: sellingPrice },
      { name: 'categoryId', value: categoryId },
      { name: 'stock', value: stock }
    ];

    const result = await sqlHelper.execute('sp_UpdateProduct', params);
    resultHelper.mutationStatus(result, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { brandId } = req.user; // Assuming req.user contains user information

  try {
    const params = [{ name: "id", value: id }];

    // Check brand manager's authorization
    if (req.user.userType === "brandManager") {
      const product = await sqlHelper.execute(`[sp_GetProductById]`, params);
      if (product.recordset[0].brandId !== brandId) {
        return res.status(403).json({ message: "Not authorized to delete this product." });
      }
    }

    const result = await sqlHelper.execute(`[sp_DeleteProduct]`, params);
    resultHelper.mutationStatus(result, res);
    res.status(200).json({ message: result.recordset[0].msg });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product.",
      error: error.message,
    });
  }
});

// Get All Products (Public)
const getAllProducts = asyncHandler(async (req, res) => {
  const { id, userType } = req.user; // Assuming user info is in req.user
console.log(id,userType)
  try {
    const params = [
      { name: 'userId', value: id },
      { name: 'userType', value: userType }
    ];
    console.log(params)
    
    const result = await sqlHelper.execute('sp_GetProducts', params);
    res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Product by ID
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Please mention the product ID." });
  }

  try {
    const params = [{ name: "id", value: id }];
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
