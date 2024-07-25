const express = require("express");
const { protect, isAdmin, isBrandManager, isAdminOrBrandManager } = require("../../middleware/auth.middleware.js");
const productController = require("../../controller/V1/products.js");
const router = express.Router();



router.route("/")
.post(protect,isAdminOrBrandManager,productController.addProduct)
.put(protect,isAdminOrBrandManager,productController.updateProduct)
.get(protect,isAdminOrBrandManager,productController.getAllProducts);


router.route("/:id")
.delete(protect,isAdmin,isBrandManager,productController.deleteProduct)
.get(protect,isAdmin,isBrandManager,productController.getProductById);




module.exports = router;




