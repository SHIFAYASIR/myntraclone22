const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const generateToken = require("../../utils/generateToken.helper");
const error = require("../../middleware/auth.middleware");
const resultHelper = require("../../utils/result.helper");
const { restart } = require("nodemon");

 






const AddAdmin = asyncHandler(async (req, res) => {
  try {
    const newUser = sqlHelper.fetchParams(req.body);
    console.log(newUser)
    const result = await sqlHelper.execute(`[sp_registerAdmin]`, newUser);
    console.log(result)
    resultHelper.createStatus(result, res);
    res.status(200).json({ message: result.recordset[0].msg });
  } catch (error) {
    res.status(500).json({
      message: "Failed to register user.",
      error: error.message
    });
  }
});
const AddBrandManager = asyncHandler(async (req, res) => {
  try {
      const newUser = sqlHelper.fetchParams(req.body);
      console.log(newUser)
      const result = await sqlHelper.execute(`[sp_RegisterBrandManager]`, newUser);
      console.log(result)
      resultHelper.createStatus(result, res);
      res.status(200).json({ message: result.recordset[0].msg });
    } catch (error) {
      res.status(500).json({
        message: "Failed to register brandManager.",
        error: error.message
      });
    }
  });


  const AddCustomer = asyncHandler(async (req, res) => {
    try {
      const newUser = sqlHelper.fetchParams(req.body);
      console.log(newUser)
      const result = await sqlHelper.execute(`[sp_RegisterCustomer]`, newUser);
      resultHelper.createStatus(result, res);
      res.status(200).json({ message: result.recordset[0].msg });
    } catch (error) {
      res.status(500).json({
        message: "Failed to register customer",
        error: error.message
      });
    }
  });
  

  const getAll = asyncHandler(async (req, res) => {
    console.log(req.user)
      try {
          const result = await sqlHelper.execute('sp_GetAllUsers');
          resultHelper.getStatus(result, res);
      } catch (error) {
          res.status(500).json({ message: error.message });
      }
  });

  const GetAllBrandManagers = asyncHandler(async (req, res) => {
    try {
        const result = await sqlHelper.execute('sp_GetAllBrandManagers');
        resultHelper.getStatus(result, res);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


const getById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the id parameter
  if (!id || isNaN(id)) {
    return res.status(400).json({ message: "Please Mention the userID " });
  }

  try {
    // Set up parameters for the stored procedure
    const params = [{ name: "id", value: id }];

    // Execute the stored procedure
    const result = await sqlHelper.execute('[sp_GetUserById]', params);

    resultHelper.getStatusById(result, res);
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
});


const loginUser = asyncHandler(async (req, res) => {
  const loginDetails = sqlHelper.fetchParams(req.body);
  try {
    const result = await sqlHelper.execute('sp_LoginUser', loginDetails);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      data: result.recordset[0],
      token: generateToken(result.recordset[0].Id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

  const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id; // Assuming req.user contains user information from authentication middleware
        const { username, email, firstName, lastName, phone, address, brandName } = req.body;

        const params = [
            { name: "id", value: userId },
            { name: "username", value: username },
            { name: "email", value: email },
            { name: "firstName", value: firstName },
            { name: "lastName", value: lastName },
            { name: "phone", value: phone },
            { name: "address", value: address },
            { name: "brandName", value: brandName },
        ];

        const result = await sqlHelper.execute('[sp_UpdateUser]', params);
        resultHelper.mutationStatus(result, res);
        res.status(200).json({ message: result.recordset[0].Message });
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });

const approveBrandManager = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
      console.log(id)

      const params = [
          { name: "id", value: id }
      ];
console.log(params)
      const result = await sqlHelper.execute('sp_ApproveBrandManager', params);

    resultHelper.getStatusById(result,res);
  } catch (error) {
      res.status(500).json({ message: "Failed to approve brand manager.", error: error.message });
  }
}); 


  module.exports = {
    AddAdmin,
    AddCustomer,
    AddBrandManager,
    getAll,
    getById,
    GetAllBrandManagers,
    updateUserProfile,
    approveBrandManager,
    loginUser,
  };