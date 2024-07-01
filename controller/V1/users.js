const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const generateToken = require("../../utils/generateToken.helper");
const error = require("../../middleware/auth.middleware");
const resultHelper = require("../../utils/result.helper");
const bcrypt = require('bcryptjs');



const register = asyncHandler(async (req, res) => {
    try {
      const newUser = sqlHelper.fetchParams(req.body);
      const result = await sqlHelper.execute(`[sp_RegisterUser]`, Object.values(newUser));
      resultHelper.createStatus(result, res);
    } catch (error) {
      res.status(500).json({
        message: "Failed to register user.",
        error: error.message
      });
    }
  });
  
  // Login User
  const login = asyncHandler(async (req, res) => {
      const loginDetails = sqlHelper.fetchParams(req.body);
      try {
        const result = await sqlHelper.execute(`sp_LoginUser`, loginDetails);

  
        res.status(200).json({
          data: result.recordset[0],
          token: generateToken(result.recordset[0].id),
        });
      } catch (error) {
        res.status(500).json(error);
      }
    });
    const getAllusers = asyncHandler(async (req, res) => {
      try {
        const result = await sqlHelper.execute(`sp_GetAllUsers`);
        resultHelper.getStatus(result, res);
      } catch (error) {
        res.status(500).json(error);
      }
    });
    
    const getUserById = asyncHandler(async (req, res) => {
      try {
        const result = await sqlHelper.execute(`sp_GetUserById`, [
          { name: "ID", value: req.params.id },
        ]);
        resultHelper.getStatusById(result, res);
      } catch (error) {
        res.status(500).json({
          message: error,
        });    
      }
    });
 
const userUpdate = asyncHandler(async (req, res) => {
  try {
    const { ID, username, password, email, first_name, last_name, phone, address } = req.body;

    // Ensure a userId is provided for the update operation
    if (!ID) {
      return res.status(404).json({
        message: "User ID is required for updating."
      });
    }
    const params = [
      { name: "Id", value: ID },
      { name: "username", value: username },
      { name: "password", value: password },
      { name: "email", value: email },
      { name: "firstName", value: first_name },
      { name: "lastName", value: last_name },
      { name: "phone", value: phone },
      { name: "address", value: address }
    ];

    const result = await sqlHelper.execute("sp_UpdateUser", params);
    res.status(200).json({ message: result.recordset[0].MSG });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const DeleteUser = asyncHandler(async (req, res) => {
  const reqId = parseInt(req.params.id);
  try {
    const result = await sqlHelper.execute(`sp_GetUserById`, [
      { name: "id", value: reqId },
    ]);       


    let user = result.recordset.length ? result.recordset[0] : null;
    if (user) {
      const result = await sqlHelper.execute(`[sp_DeleteUserById]`, [
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

    

    module.exports = {
        register,
        login,
        getAllusers,
        getUserById,
        userUpdate,
        DeleteUser,
       
      };  