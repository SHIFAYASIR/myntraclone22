const express = require("express");
const { protect, admin } = require("../../middleware/auth.middleware.js");
const Admin = require("../../controller/V1/Admin.js");
const BrandManager = require("../../controller/V1/BrandManager.js");
const router = express.Router();







router.route("/")
.put(protect,Admin.updateUser)
.get(protect,Admin.getAllUsers)

router.route("/:id")
.delete(protect,Admin.deleteUser)
.get(protect,Admin.getUserById);

router.route("/getBrandManger")
.get([protect,admin],BrandManager.getAll)



// router.route("/:id")
// .delete(protect,Admin.deleteProduct)
// .get(protect,Admin.getProductById);

// router.route("/Login")
// .post(Admin.loginAdmin);






module.exports = router;




