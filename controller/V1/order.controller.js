const asyncHandler = require('express-async-handler');
const sqlHelper = require('../../utils/sql.helper');
const resultHelper = require('../../utils/result.helper');

const placeOrder = asyncHandler(async (req, res) => {
  try {
    // Check if the user is authenticated and has a valid recordset
    if (!req.user || !req.user.recordset || !req.user.recordset[0]) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const userId = parseInt(req.user.recordset[0].Id);
    console.log("userID:", userId);

    // Parameters for sp_PlaceOrder
    const params = [
      { name: 'userId', value: userId }
    ];

    // Call the stored procedure to place the order
    const result = await sqlHelper.execute('sp_PlaceOrder', params);

    // Check the result and handle different statuses
    if (result.recordset[0].STATUS === 0) {
      res.status(200).json({
        total: result.recordset[0].Total,
        orderDetailId: result.recordset[0].OrderDetailId,
        message: result.recordset[0].MSG
      });
    } else {
      res.status(400).json({
        message: result.recordset[0].MSG,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const userId = parseInt(req.user.recordset[0].Id);
    const result = await sqlHelper.execute('sp_GetUserOrders', [{ name: 'userId', value: userId }]);
    resultHelper.getStatus(result, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  placeOrder,
  getUserOrders,
};
