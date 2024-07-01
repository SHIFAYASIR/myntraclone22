const express = require("express");
const { protect } = require("../../middleware/auth.middleware.js");
const userController = require("../../controller/V1/users.js");
const router = express.Router();



router.route("/Login")
.post(userController.login);
router.route("/")
.post( userController.register)
.put(userController.userUpdate)

.get(userController.getAllusers);


router.route("/:id")
.delete(userController.DeleteUser)
.get(userController.getUserById);




module.exports = router;




