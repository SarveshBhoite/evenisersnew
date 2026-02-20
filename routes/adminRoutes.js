const express = require("express");
const router = express.Router();
const { protect, admin, requireRoleOrPermission } = require("../middleware/authMiddleware");
const User = require("../models/Users");
const Order = require("../models/Order"); // Import Order Model

// @desc    Get All Users (Existing)
router.get("/users", protect, requireRoleOrPermission("users"), async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// 🚨 NEW: Get Revenue Statistics
router.get("/revenue", protect, requireRoleOrPermission("revenue"), async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    // 1. Calculate Totals
    const totalRevenue = orders.reduce((acc, order) => acc + (order.amountPaid || 0), 0);
    const totalPending = orders.reduce((acc, order) => acc + (order.remainingAmount || 0), 0);
    const totalOrders = orders.length;

    // 2. Calculate Average Order Value
    const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // 3. Get Monthly Revenue (For Graphs/Charts)
    // This aggregates data by month
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amountPaid" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 4. Send Response
    res.json({
      totalRevenue,
      totalPending,
      totalOrders,
      avgOrderValue,
      recentOrders: orders.slice(0, 5), // Send last 5 orders for the table
      monthlyRevenue
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error calculating revenue" });
  }
});

module.exports = router;