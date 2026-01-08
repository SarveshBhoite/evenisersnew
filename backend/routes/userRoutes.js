const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const { protect } = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");

// @desc    Get all regular users (Excluding Admins)
router.get("/", protect, async (req, res) => {
  try {
    // 🚨 Filter: Only fetch accounts where role is exactly "user"
    const users = await User.find({ role: "user" })
      .select("-password") // Don't send passwords
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.route("/profile")
    .get(protect, userController.getUserProfile)
    .put(protect, userController.updateUserProfile);

router.route("/password").put(protect, userController.changePassword);
module.exports = router;