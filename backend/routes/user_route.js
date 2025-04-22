const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

//Register User
router.post("/register", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      favorites: [],
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Send token in a secure HTTP-only cookie
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Enable in production
      sameSite: "strict",
      maxAge: 86400000, // 1 day
      path: "/",
    });

    // Return token along with the success message
    res.status(200).json({
      message: "Login successful",
      token: token, // Include the token in the response body
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout User
router.post("/logout", (req, res) => {
  try {
    // Clear the HTTP-only cookie containing the JWT token
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to false for development
      sameSite: 'strict',
      path: '/',
    });

    // Respond with success message
    res.status(200).json({ message: 'User logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Add/Remove Favorite Country (Protected Route)
router.post("/favorites", verifyToken, async (req, res) => {
  const { countryCode } = req.body;

  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Toggle favorite country
    const index = user.favorites.indexOf(countryCode);
    if (index === -1) {
      user.favorites.push(countryCode); // Add to favorites
    } else {
      user.favorites.splice(index, 1); // Remove from favorites
    }

    await user.save();
    res.status(200).json({ message: "Favorites updated", favorites: user.favorites });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Get User Favorites (Protected Route)
router.get("/favorites", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Favorites retrieved successfully",
      favorites: user.favorites,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;