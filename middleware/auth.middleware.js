const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const slqHelper = require('../utils/sql.helper');




const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
       console.log("token", token)

      const decoded = jwt.verify(token, process.env.JWT_SECRET);


     let res = await slqHelper.execute(`sp_UserById`, [
        {
          name: 'id',
          value: parseInt(decoded.id),
        },
      ]);
      console.log(res);
      req.user =  res.recordset[0];

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});


/**
 * Middleware function to check if the user is authorized as an admin.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If the user is not authorized as an admin.
 */
const isAdmin = (req, res, next) => {
  console.log("user",req.user)
  if (req.user && req.user.userType == 1) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

/**
 * Middleware function to check if the user is authorized as a brand manager.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {Error} If the user is not authorized as a brand manager.
 */
const isBrandManager = (req, res, next) => {
  console.log("user",req.user)
  if (req.user && req.user.userType == 3) {
    next();
  } else {
    
    res.status(401);
    throw new Error('Not authorized as an BrandManager');
  }
};


const isAdminOrBrandManager = (req, res, next) => {
  console.log("user",req.user)
  if (req.user && req.user.userType == 3 ||  req.user.userType == 1 ) {
    next();
  } else {
    
    res.status(401);
    throw new Error('Not authorized as an BrandManager');
  }
};
module.exports = { protect, isAdmin,isBrandManager,isAdminOrBrandManager };
