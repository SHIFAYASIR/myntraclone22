const express = require("express");
const { protect, admin } = require("../../middleware/auth.middleware.js");
const Admin = require("../../controller/V1/Admin.js");
const router = express.Router();


router.route("/")
.post( Admin.AddAdmin);



router.route("/Login")
.post(Admin.loginAdmin);

router.route("/")
.put(protect,Admin.updateUser)
.get(protect,Admin.getAllUsers);

router.route("/:id")
.delete(protect,Admin.deleteUser)
.get(protect,Admin.getUserById);

router.route("/")

.put(protect,Admin.updateProduct)
.get(protect,Admin.getAllProducts);


router.route("/:id")
.delete(protect,Admin.deleteProduct)
.get(protect,Admin.getProductById);







module.exports = router;




