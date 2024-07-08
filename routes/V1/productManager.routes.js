const express = require("express");
const { protect, admin } = require("../../middleware/auth.middleware.js");
const productManager = require("../../controller/V1/productManager.js");
const router = express.Router();


router.route("/")
.post( productManager.registerProductManager)
.put(protect,productManager.updateProductManager);


router.route("/Login")
.post(productManager.loginProductManager);



router.route("/:id")
.delete(protect,productManager.deleteProductManager);

module.exports = router;
