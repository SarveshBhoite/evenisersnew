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

// @desc    Get All Orders (For Dashboard)
router.get("/orders", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;