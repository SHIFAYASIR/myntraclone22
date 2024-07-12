const express = require("express");
const { protect } = require("../../middleware/auth.middleware.js");
const userController = require("../../controller/V1/customer.js");
const router = express.Router();




router.route("/")
.post( userController.registerCustomer)
.put(userController.userUpdate)

.get(userController.getAllusers);


router.route("/:id")
.delete(userController.DeleteUser)
.get(userController.getUserById);

router.route("/Login")
.post(userController.login);




module.exports = router;




