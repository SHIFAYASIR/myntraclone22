const asyncHandler = require("express-async-handler");
const sqlHelper = require("../../utils/sql.helper");
const generateToken = require("../../utils/generateToken.helper");
const error = require("../../middleware/auth.middleware");
const resultHelper = require("../../utils/result.helper");
const { restart } = require("nodemon");
const { use } = require("../../routes/V1/user.routes");

const AddAdmin = asyncHandler(async (req, res) => {
  try {
    const newUser = sqlHelper.fetchParams(req.body);
    const user=req.body;
   //firstName 
//console.log(user.password)

if(user.firstName==null || user.firstName=="")
  {
    return res.status(400).json({
      status:0,
      msg:"firstName is required",


    });
  }
     
    
    if(user.password==null || user.password=="")
    {
      return res.status(400).json({
        status:0,
        msg:"Password is required",


      });
      
    } 

    if(user.username==null || user.username=="")
      {
        return res.status(400).json({
          status:0,
          msg:"username is required",
  
  
        });
        
      } 
      if(user.email==null || user.email=="")
        {
          return res.status(400).json({
            status:0,
            msg:"email is required",
    
    
          });
          
        } 
        if(user.phone==null || user.phone=="")
          {
            return res.status(400).json({
              status:0,
              msg:"phone is required",
      
      
            });
            
          } 
    const result = await sqlHelper.execute(`sp_registerAdmin`, newUser);
   // console.log(result)
    resultHelper.createStatus(result, res);
 
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
      const user=req.body;
    
      //console.log(user.password)
      if(user.firstName==null || user.firstName=="")
        {
          return res.status(400).json({
            status:0,
            msg:"firstName is required",
      
      
          });
        }
          
          
          if(user.password==null || user.password=="")
          {
            return res.status(400).json({
              status:0,
              msg:"Password is required",
      
      
            });
            
          } 
      
          if(user.username==null || user.username=="")
            {
              return res.status(400).json({
                status:0,
                msg:"username is required",
        
        
              });
              
            } 
            if(user.email==null || user.email=="")
              {
                return res.status(400).json({
                  status:0,
                  msg:"email is required",
          
          
                });
                
              } 
              if(user.phone==null || user.phone=="")
                {
                  return res.status(400).json({
                    status:0,
                    msg:"phone is required",
            
            
                  });
                  
                } 
      //console.log(newUser)
      const result = await sqlHelper.execute(`[sp_RegisterBrandManager]`, newUser);
      //console.log(result)
      resultHelper.createStatus(result, res);
     
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
      const user=req.body;
    
      //console.log(user.password)
      if(user.firstName==null || user.firstName=="")
        {
          return res.status(400).json({
            status:0,
            msg:"firstName is required",
      
      
          });
        }
          
          if(user.password==null || user.password=="")
          {
            return res.status(400).json({
              status:0,
              msg:"Password is required",
      
      
            });
            
          } 
      
          if(user.username==null || user.username=="")
            {
              return res.status(400).json({
                status:0,
                msg:"username is required",
        
        
              });
              
            } 
            if(user.email==null || user.email=="")
              {
                return res.status(400).json({
                  status:0,
                  msg:"email is required",
          
          
                });
                
              } 
              if(user.phone==null || user.phone=="")
                {
                  return res.status(400).json({
                    status:0,
                    msg:"phone is required",
            
            
                  });
                  
                } 
      //console.log(newUser)
      const result = await sqlHelper.execute(`[sp_RegisterCustomer]`, newUser);
      resultHelper.createStatus(result, res);
      
    } catch (error) {
      res.status(500).json({
        message: "Failed to register customer",
        error: error.message
      });
    }
  });
  

  const getAll = asyncHandler(async (req, res) => {
    //console.log(req.user)
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
  if(req.body.username==null || req.body.username=="")
      {
        return res.status(400).json({
          status:0,
          msg:"username is required",
    
    
        });
      }
      if(req.body.password==null || req.body.password=="")
        {
          return res.status(400).json({
            status:0,
            msg:"password is required",
      
      
          });
        }
  const loginDetails = sqlHelper.fetchParams(req.body);
  try {

    
    // 
    const result = await sqlHelper.execute('sp_LoginUser', loginDetails);

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      data: result.recordset[0],
      token: generateToken(result.recordset[0].id),
    });
  } catch (error) {
    //console.log(error);
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
        
      } catch (error) {
        res.status(500).json({
          message: error.message,
        });
      }
    });

const approveBrandManager = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
     // console.log(id)

      const params = [
          { name: "id", value: id }
      ];
//console.log(params)
      const result = await sqlHelper.execute('sp_ApproveBrandManager', params);

    resultHelper.getStatusById(result,res);
  } catch (error) {
      res.status(500).json({ message: "Failed to approve brand manager.", error: error.message });
  }
}); 

const wishlist = asyncHandler(async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const userId = parseInt(req.user.id);
    const userRole = req.user.userType;

  
    console.log("Product ID:", productId);
    console.log("User ID:", userId);

    if (userRole !== 2) {
      return res.status(403).json({
        message: "Only register customers can add items to the wishlist",
      });
    }

    

    if (userId && productId) {
      const updateResult = await sqlHelper.execute("[sp_AddToWishlist]", [
        { name: "productId", value: productId },
        { name: "userId", value: userId }
      ]);

      resultHelper.mutationStatus(updateResult, res);
    } else {
      res.status(404).json({
        message: "Record not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

const addItemToCart = asyncHandler(async (req, res) => {
  try {
    const { Quantity, ProductId } = req.body;
    const userId = parseInt(req.user.id);
    const userRole = req.user.userType; // Assuming role is part of user object
    if (userRole !== 2) {
      return res.status(403).json({
        message: "Only register customers can add items to the cart",
      });
    }

    if (Quantity && ProductId && userId) {
      const params = [
        { name: "quantity", value: Quantity },
        { name: "productId", value: ProductId }, 
        { name: "userId", value: userId }
      ];

      const result = await sqlHelper.execute('sp_AddItemToCart', params);
      console.log(result);
      resultHelper.createStatus(result, res);
    } else {
      res.status(400).json({
        message: "Invalid parameters provided.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    }); 
  }
});
const getCartItems = asyncHandler(async (req, res) => {
  try {
    const userId = parseInt(req.user.id);
    const result = await sqlHelper.execute('GetCartUserItems', [{ name: 'userId', value: userId }]);
    resultHelper.getStatus(result, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


const removeCartItem = asyncHandler(async (req, res) => {
  console.log(req.body)
  try {
    const userId = parseInt(req.user.id);
   
    const {productId} = req.body;
    console.log(userId,productId)
    if (productId && userId) {
      const params=[
        { name: "productId", value: productId },
         { name: "userId", value: userId }

      ];
  
      const updateResult = await sqlHelper.execute("[sp_RemoveCartItem]",params);

      resultHelper.mutationStatus(updateResult, res);
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


// Update Cart Item Quantity ---  @UserId INT,
  // @ProductId INT,
   // @Quantity INT
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  console.log(req.body)
  try {
    const { ProductId,Quantity} = req.body;
    const userId = parseInt(req.user.id);
    console.log(ProductId,Quantity,userId)
    console.log("dasdasdasd")

    const userRole = req.user.userType; // Assuming role is part of user object
    console.log(userRole)
    if (userRole !== 2) { 
      return res.status(403).json({
        message: "Only register customers can add items to the cart",
      });
    }

    if (ProductId && Quantity && userId ) {
      const params = [
        { name: "ProductId", value: ProductId },
        { name: "Quantity", value: Quantity },
        { name: "userId", value: userId }
      ];

      const result = await sqlHelper.execute("sp_UpdateCart", params);
      resultHelper.mutationStatus(result,res)
    } else {
      res.status(400).json({ message: "Invalid parameters provided." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const placeOrder = asyncHandler(async (req, res) => {
  try {
    // Check if the user is authenticated and has a valid recordset

    console.log(req.user.id)
    if (!req.user.id  ) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const userId = parseInt(req.user.id);
    console.log("userID:", userId);

    // Parameters for sp_PlaceOrder
    const params = [
      { name: 'userId', value: userId }
    ];

    // Call the stored procedure to place the order
    const result = await sqlHelper.execute('sp_PlaceOrder', params);

    // Check the result and handle different statuses
        resultHelper.createStatus(result, res);
    } 
  catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


const getUserOrders = asyncHandler(async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const userId = parseInt(req.user.id);

    // Call the stored procedure to get user orders
    const result = await sqlHelper.execute('[sp_GetUserOrders]', [
      { name: 'userId', value: userId }
    ]);

    // Handle the result
    resultHelper.getStatus(result, res);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
const getMostSellingProducts = asyncHandler(async (req, res) => {
  const { brandName } = req.params; // assuming brandName is passed as a route parameter

  try {
      const params = [{ name: 'brandName', value: brandName }];
      const result = await sqlHelper.execute('sp_GetAllSellingProducts', params);
       resultHelper.getStatus(result, res);
      
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const getAllProductsForCustomer = asyncHandler(async (req, res) => {
  try {
    const result = await sqlHelper.execute('sp_GetAllProducts');
    res.status(200).json(result.recordset); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
  module.exports = {
    getAllProductsForCustomer,
    getMostSellingProducts,
    getUserOrders,
    placeOrder,
    updateCartItemQuantity,
    removeCartItem,
    AddAdmin,
    AddCustomer,
    AddBrandManager,
    getAll,
    getById,
    GetAllBrandManagers,
    updateUserProfile,
    approveBrandManager,
    loginUser,
    wishlist,
    addItemToCart,
    getCartItems,
    
  };