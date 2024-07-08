const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const generateToken = require("../../utils/generateToken.helper");
const error = require("../../middleware/auth.middleware");
const resultHelper = require("../../utils/result.helper");
const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

const uploadProductImage = (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    res.status(200).json({ message: 'File uploaded successfully', filePath });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const addProducts = asyncHandler(async (req, res) => {
  try {
    // Check if user is authenticated and has a valid recordset
    if (!req.user || !req.user.recordset || !req.user.recordset[0]) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const { name, description, price, stock, category, brand,imagePath } = req.body;
    const userId = parseInt(req.user.recordset[0].Id);

    // Check if the user is authorized
    if (userId !== 11) {
      return res.status(403).json({
        message: "You are not authorized to add a product",
      });
    }

    // Proper parameter validation
    if (name && description && price && stock && category && brand) {
      const params = [
        { name: "name", value: name },
        { name: "description", value: description },
        { name: "price", value: price },
        { name: "stock", value: stock },
        { name: "category", value: category },
        { name: "brand", value: brand },
        { name: "userId", value: userId },
        { name: 'productImage', value: imagePath }
      ];

      const result = await sqlHelper.execute('sp_CreateProduct', params);
      res.status(200).json({ message: result.recordset[0].msg });
    } else {
      res.status(400).json({
        message: "All fields are required",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

 
    
    const getproductById = asyncHandler(async (req, res) => {
      try {
        const result = await sqlHelper.execute(`sp_GetProductById`, [
          { name: "ID", value: req.params.id },
        ]);
        resultHelper.getStatusById(result, res);
      } catch (error) {
        res.status(500).json({
          message: error,
        });    
      }
    });
 
const productUpdate = asyncHandler(async (req, res) => {
  try {
    const { ID, name, description, price, stock, category, brand} = req.body;

    // Ensure a productId is provided for the update operation
    if (!ID) {
      return res.status(404).json({
        message: "product ID is required for updating."
      });
    }
    const params = [
      { name: "Id", value: ID },
      { name: "name", value: name },
      { name: "description", value: description },
      { name: "price", value: price },
      { name: "stock", value: stock },
      { name: "category", value: category },
      { name: "brand", value: brand }
      
    ];

    const result = await sqlHelper.execute("[sp_UpdateProduct]", params);
    res.status(200).json({ message: result.recordset[0].MSG });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const Deleteproduct = asyncHandler(async (req, res) => {
  const reqId = parseInt(req.params.id);
  try {
    const result = await sqlHelper.execute(`[dbo].[sp_GetProductById]`, [
      { name: "id", value: reqId },
    ]);       


    let product = result.recordset.length ? result.recordset[0] : null;
    if (product) {
      const result = await sqlHelper.execute(`[dbo].[sp_DeleteProduct]`, [
        {
          name: "id",
          value: reqId,
        },
      ]);
      console.log("delete result",result)
      res.status(200).json({message:result.recordset[0].MSG});
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
const getAllproducts = asyncHandler(async (req, res) => {
    try {
      const result = await sqlHelper.execute(`[sp_GetProducts]`);
      resultHelper.getStatus(result, res);
    } catch (error) {
      res.status(500).json(error);
    }
  });
  

    

    module.exports = {
        addProducts,
        getAllproducts,
        getproductById,
        productUpdate,
        Deleteproduct,
        upload,
        uploadProductImage
       
      };  