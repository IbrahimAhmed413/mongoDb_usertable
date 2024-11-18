const express = require("express");
const router = express.Router();

const UserController = require("../Controller/UserController");

router.get("/get", UserController.getUser);
router.post("/create", UserController.postUser);
router.put("/update/:id", UserController.edit);
router.delete("/delete/:id", UserController.del);

module.exports = router;
