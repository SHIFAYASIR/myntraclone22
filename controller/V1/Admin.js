const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const generateToken = require("../../utils/generateToken.helper");
const error = require("../../middleware/auth.middleware");
const resultHelper = require("../../utils/result.helper");
const bcrypt = require('bcryptjs');

// Add Admin
const AddAdmin = asyncHandler(async (req, res) => {
    try {
      const newUser = sqlHelper.fetchParams(req.body);
      console.log(newUser)
      const result = await sqlHelper.execute(`sp_AddAdmin`, newUser);
      console.log(result)
      res.status(200).json({ message: result.recordset[0].msg });
    } catch (error) {
      res.status(500).json({
        message: "Failed to register user.",
        error: error.message
      });
    }
  });
  
  
// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
    const loginDetails = sqlHelper.fetchParams(req.body);
    console.log(loginDetails)
    try {
      const result = await sqlHelper.execute(`sp_LoginAdmin`, loginDetails);
      console.log(result)
      res.status(200).json({
        data: result.recordset[0],
        token: generateToken (result.recordset[0].id),
      });
    } catch (error) {
        console.log(error);
      res.status(500).json(error);
    }
  });

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const result = await sqlHelper.execute('sp_GetAllUsers');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//hello
const getUserById = asyncHandler(async (req, res) => {
    try {
      const result = await sqlHelper.execute(`sp_GetUserById`, [
        { name: "id", value: req.params },
      ]);
      resultHelper.getStatusById(result, res);
    } catch (error) {
      res.status(500).json({
        message: error,
      });
    }
  });
// Update User
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, email, firstName, lastName, phone, address } = req.body;

    try {
        const params = [
            { name: "id", value: id },
            { name: "username", value: username },
            { name: "email", value: email },
            { name: "firstName", value: firstName },
            { name: "lastName", value: lastName },
            { name: "phone", value: phone },
            { name: "address", value: address }
        ];

        const result = await sqlHelper.execute('sp_UpdateUser', params);
        res.status(200).json({ message: result.recordset[0].msg });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const params = [{ name: "id", value: id }];

        const result = await sqlHelper.execute('sp_DeleteUser', params);
        res.status(200).json({ message: result.recordset[0].msg });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Products
const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const result = await sqlHelper.execute('sp_GetAllProducts');
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Product By ID
const getProductById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const params = [{ name: "id", value: id }];

        const result = await sqlHelper.execute('sp_GetProductById', params);
        res.status(200).json(result.recordset[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const { id, name, description, price, stock, category, brand, imageUrl } = req.body;

    try {
        const params = [
            { name: "id", value: id },
            { name: "name", value: name },
            { name: "description", value: description },
            { name: "price", value: price },
            { name: "stock", value: stock },
            { name: "category", value: category },
            { name: "brand", value: brand },
            { name: "imageUrl", value: imageUrl }
        ];

        const result = await sqlHelper.execute('sp_UpdateProduct', params);
        res.status(200).json({ message: result.recordset[0].msg });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const params = [{ name: "id", value: id }];

        const result = await sqlHelper.execute('sp_DeleteProduct', params);
        res.status(200).json({ message: result.recordset[0].msg });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = {
    AddAdmin,
    loginAdmin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
