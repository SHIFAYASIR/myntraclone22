const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const generateToken = require("../../utils/generateToken.helper");
const error = require("../../middleware/auth.middleware");
const resultHelper = require("../../utils/result.helper");
const bcrypt = require('bcryptjs');





// Register Product Manager
const registerProductManager = asyncHandler(async (req, res) => {
    try {
        const { username, email, password, firstName, lastName, brandId } = req.body;

        const params = [
            { name: "username", value: username },
            { name: "email", value: email },
            { name: "password", value: password },
            { name: "firstName", value: firstName },
            { name: "lastName", value: lastName },
            { name: "brandId", value: brandId }
        ];

        const result = await sqlHelper.execute('sp_RegisterProductManager', params);
        res.status(201).json({ message: "Product Manager registered successfully", data: result.recordset });
    } catch (error) {
        res.status(500).json({ message: "Failed to register product manager.", error: error.message });
    }
});

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
const updateProductManager = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, firstName, lastName, brandId } = req.body;

        const params = [
            { name: "id", value: id },
            { name: "username", value: username },
            { name: "email", value: email },
            { name: "firstName", value: firstName },
            { name: "lastName", value: lastName },
            { name: "brandId", value: brandId }
        ];

        const result = await sqlHelper.execute('sp_UpdateProductManager', params);
        res.status(200).json({ message: "Product Manager updated successfully", data: result.recordset });
    } catch (error) {
        res.status(500).json({ message: "Failed to update product manager.", error: error.message });
    }
});

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
    registerProductManager,
    loginProductManager,
    updateProductManager,
    deleteProductManager
};