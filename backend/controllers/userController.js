const User = require("../models/Users");
const bcrypt = require("bcryptjs");

// @desc    Get Current User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Allow updating name and other details
      user.name = req.body.name || user.name;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.city = req.body.city || user.city;
      user.state = req.body.state || user.state;
      user.zip = req.body.zip || user.zip;
      user.country = req.body.country || user.country;

      // 🚨 Special Handling for Email (Allow setting if missing or changing)
      if (req.body.email && req.body.email !== user.email) {
        // Check if new email is already taken by another user
        const emailExists = await User.findOne({ email: req.body.email, _id: { $ne: user._id } });
        if (emailExists) {
          return res.status(400).json({ message: "Email is already in use by another account" });
        }
        user.email = req.body.email;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        permissions: updatedUser.permissions,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// @desc    Change Password
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await bcrypt.compare(oldPassword, user.password))) {
      user.password = newPassword; // Will be hashed by pre-save hook
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else {
      res.status(401).json({ message: "Invalid old password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};