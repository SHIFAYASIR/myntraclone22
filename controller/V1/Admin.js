const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const generateToken = require("../../utils/generateToken.helper");
const error = require("../../middleware/auth.middleware");
const resultHelper = require("../../utils/result.helper");
const bcrypt = require('bcryptjs');

// Add Admin
const registerAdmin = asyncHandler(async (req, res) => {
    try {
      const newUser = sqlHelper.fetchParams(req.body);
      console.log(newUser)
      const result = await sqlHelper.execute(`[sp_registerAdmin]`, newUser);
      console.log(result)
      res.status(200).json({ message: result.recordset[0].msg });
    } catch (error) {
      res.status(500).json({
        message: "Failed to register user.",
        error: error.message
      });
    }
  });
  //practice
  
  
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

 

const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  console.log(userId)

  if (userId==":id") {
    return res.status(400).json({
      message: "Please enter the ID of the user.",
    });
  }

  try {
    const result = await sqlHelper.execute(`sp_GetUserById`, [
      { name: "id", value: userId },
    ]);
    console.log(result);
    resultHelper.getStatusById(result, res);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// Update User
const updateUser = asyncHandler(async (req, res) => {
  const userId = req.user.recordset[0].id; 
  const userIdInt = parseInt(userId);
  const { username, email, firstName, lastName, phone, address } = req.body;
  try {
    if (userIdInt !== parseInt(req.body.id)) {
      return res.status(403).json({ message: 'You do not have permission to update this profile.' });
    }

    const params = [
      { name: "id", value: userIdInt },
      { name: "username", value: username },
      { name: "email", value: email },
      { name: "firstName", value: firstName },
      { name: "lastName", value: lastName },
      { name: "phone", value: phone },
      { name: "address", value: address }
    ];

    // Execute the stored procedure to update the user
    const result = await sqlHelper.execute('sp_UpdateUser', params);
    

    // Respond with a success message
    res.status(200).json({ message: result.recordset[0].Message });
  } catch (error) {
    // Handle errors and respond with an error message
    res.status(500).json({ message: error.message });
  }
});

// Delete User
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    try {
        const params = [{ name: "id", value: id }];
       

        const result = await sqlHelper.execute('[sp_deleteUser]', params);
        
        res.status(200).json({ message: result.recordset[0].MSG });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Get Product By ID


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
//delte the product
//asasdsad

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
 
    loginAdmin,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getProductById,
    updateProduct,
    deleteProduct
};
