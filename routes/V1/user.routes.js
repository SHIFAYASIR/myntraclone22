const express = require("express");
const { protect, isAdmin, isBrandManager } = require("../../middleware/auth.middleware.js");
const userController = require("../../controller/V1/user.js");
const router = express.Router();

router.route("/Admin")
.post(userController.AddAdmin)
.get(userController.getAll)





router.route("/BrandManager")

.post(userController.AddBrandManager)
.get(protect,isAdmin,userController.GetAllBrandManagers);

router.route("/BrandManager/:id")

.put(protect, isAdmin, userController.approveBrandManager);

router.route("/customer")
.post(userController.AddCustomer)

router.route("/:id")
// .delete(protect,Admin.deleteUser)
.get(protect,isAdmin,userController.getById)
.put(protect,isAdmin, userController.updateUserProfile);




router.route("/customer")

.post(userController.AddCustomer)


router.route("/Login")
.post(userController.loginUser);


module.exports = router;