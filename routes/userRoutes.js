const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// user sign in
router.post("/login", userController.login);

// user sign up
router.post("/register", userController.register);

module.exports = router;
