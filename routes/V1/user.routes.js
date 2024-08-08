const express = require("express");
const { protect, isAdmin, isBrandManager, isAdminOrBrandManager } = require("../../middleware/auth.middleware.js");
const userController = require("../../controller/V1/user.js");
const router = express.Router();



router.route("/")
.post(userController.AddCustomer)
.get(protect,userController.getAllProductsForCustomer);



   
router.route("/login")
.post(userController.loginUser);

router.route("/admin")
.post(userController.AddAdmin)
.get(userController.getAll)

router.route("/customer")
.post(userController.AddCustomer)




router.route("/brand-manager")
.post(userController.AddBrandManager)
.get(protect,isAdmin,userController.GetAllBrandManagers);

router.route("/brand-manager/:id")
.put(protect, isAdmin, userController.approveBrandManager);

router.route("/wishlist/:id")
  .put(protect, userController.wishlist);

  router.route("/cart")
  .post( protect,userController.addItemToCart)
  .delete( protect,userController.removeCartItem)
  .get(protect,userController.getCartItems)
  .put( protect,userController.updateCartItemQuantity);
  
  router.route("/orders")
  .post(protect, userController.placeOrder)
  .get(protect, userController.getUserOrders);

  router.route('/most-selling/:brandName')
   .get(protect,isAdminOrBrandManager ,userController.getMostSellingProducts);



router.route("/:id")
// .delete(protect,Admin.deleteUser)
.get(protect,isAdmin,userController.getById)
.put(protect,isAdmin, userController.updateUserProfile);









module.exports = router;