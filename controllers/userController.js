require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const logger = require("../logger");
const { validationResult, body } = require("express-validator");

const key = process.env.SECREAT_KEY;

// validation for registration
const registerValidations = [
  body("email").isEmail().withMessage("Invalid email"),
  body("name").notEmpty().withMessage("Name is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];


// validation for login
const loginValidations = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// 1. user registration logic
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Registration validation failed", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // Retrieve the registration data from the request body
    const { email, name, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.info("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new User
    const newUser = new User({
      email,
      name,
      password: hashedPassword,
    });

    // Save the User to the database
    await newUser.save();

    logger.info("User registered successfully");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error("Registration failed", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

// user login logic
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Login validation failed", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }
    // Retrieve the login data from the request body
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      logger.info("Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.info("Invalid email or password");
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user._id }, key);

    const userWithoutPassword = { ...user._doc };
    delete userWithoutPassword.password;

    logger.info("User logged in successfully");
    res.status(200).json({ token, user: userWithoutPassword  });
  } catch (error) {
    logger.error("Login failed", error);
    res.status(500).json({ message: "Login failed" });
  }
};

module.exports = {
  register: [...registerValidations, register],
  login: [...loginValidations, login],
};
