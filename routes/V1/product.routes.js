const express = require("express");
const { protect } = require("../../middleware/auth.middleware.js");
const productController = require("../../controller/V1/products.js");
const router = express.Router();



router.route("/")
.post( productController.addProducts)
.put(productController.productUpdate)
.get(productController.getAllproducts);


router.route("/:id")
.delete(productController.Deleteproduct)
.get(productController.getproductById);




module.exports = router;




