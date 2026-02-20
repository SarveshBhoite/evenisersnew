// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        // 🚨 ADD RETURN HERE
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      return next(); // 🚨 ADD RETURN HERE
    } catch (error) {
      console.error("Token Error:", error);
      // 🚨 ADD RETURN HERE
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    // 🚨 ADD RETURN HERE
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Not authorized as an admin" });
  }
};

const requireRoleOrPermission = (permissionName) => {
  return (req, res, next) => {
    // Admin has full access
    if (req.user && req.user.role === "admin") {
      return next();
    }

    // Employee needs specific permission
    if (req.user && req.user.role === "employee") {
      if (req.user.permissions && req.user.permissions.includes(permissionName)) {
        return next();
      } else {
        return res.status(403).json({ message: `Access denied. Requires '${permissionName}' permission.` });
      }
    }

    // Other roles rejected
    return res.status(401).json({ message: "Not authorized. Admin or granted Employee access required." });
  };
};

module.exports = { protect, admin, requireRoleOrPermission };