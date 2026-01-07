const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const User = require("../models/Users");
const Order = require("../models/Order");

// @desc    Get All Users
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;