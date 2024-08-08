const express = require("express");
const { protect, isAdmin, isBrandManager, isAdminOrBrandManager } = require("../../middleware/auth.middleware.js");
const productController = require("../../controller/V1/products.js");
const router = express.Router();



router.route("/")
.post(protect,isAdminOrBrandManager,productController.addProduct)
.put(protect,isAdminOrBrandManager,productController.updateProduct)
.get(protect,productController.getAllProducts);



router.route("/:id")
.delete(protect,isAdminOrBrandManager,productController.deleteProduct)
.get(protect,isAdminOrBrandManager,productController.getProductById);




module.exports = router;




