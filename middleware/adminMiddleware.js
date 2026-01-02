const User = require("../models/Users");

const adminOnly = async (req, res, next) => {
  try {
    // req.user is set by protect middleware (user ID)
    const user = await User.findById(req.user);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access denied" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { adminOnly };
