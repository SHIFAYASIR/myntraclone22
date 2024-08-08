const express = require("express");
const { protect, isAdmin } = require("../../middleware/auth.middleware.js");
const BrandManager = require("../../controller/V1/BrandManager.js");
const router = express.Router();


router.route("/")
.get(protect,isAdmin,BrandManager.gtAll)
.post(BrandManager.registerBrandManager)
.put(protect,BrandManager.updateProductManager);

router.route("/:id")
.delete(protect,BrandManager.deleteProductManager);


router.route("/Login")
.post(BrandManager.loginProductManager);

module.exports = router;
