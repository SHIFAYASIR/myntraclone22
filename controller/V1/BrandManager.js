const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const generateToken = require("../../utils/generateToken.helper");
const error = require("../../middleware/auth.middleware");
const resultHelper = require("../../utils/result.helper");
const bcrypt = require('bcryptjs');

// Get All BrandManager 




// Register Product Manager

// Login Product Manager
const loginProductManager = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body;

        const params = [
            { name: "username", value: username },
            { name: "password", value: password }
        ];

        const result = await sqlHelper.execute('sp_LoginBrandManager', params);
        if (result.recordset[0].STATUS === 1) {
            const productManager = result.recordset[0];
            res.status(200).json({ message: "Login successful", productManager });
        } else {
            res.status(401).json({ message: result.recordset[0].MSG });
        }
    } catch (error) {
        res.status(500).json({ message: "Failed to login.", error: error.message });
    }
});

// Update Product Manager


// Delete Product Manager
const deleteProductManager = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const params = [
            { name: "id", value: id }
        ];

        const result = await sqlHelper.execute('sp_DeleteProductManager', params);
        res.status(200).json({ message: "Product Manager deleted successfully", data: result.recordset });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product manager.", error: error.message });
    }
});

module.exports = {
  
    loginProductManager,
    updateProductManager,
    deleteProductManager
};