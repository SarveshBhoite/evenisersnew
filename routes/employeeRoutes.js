const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { protect, admin, requireRoleOrPermission } = require("../middleware/authMiddleware");
const User = require("../models/Users");

// @route   POST /api/employees
// @desc    Add a new employee (Super Admin only)
// @access  Private/Admin
router.post("/", protect, requireRoleOrPermission("employee"), async (req, res) => {
    try {
        const { name, email, password, permissions } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const employee = await User.create({
            name,
            email,
            password, // Pre-save hook hashes it
            role: "employee",
            permissions: permissions || [],
            isVerified: true, // Employees created by admin don't need email verification
        });

        if (employee) {
            res.status(201).json({
                _id: employee._id,
                name: employee.name,
                email: employee.email,
                role: employee.role,
                permissions: employee.permissions,
            });
        } else {
            res.status(400).json({ message: "Invalid employee data" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   GET /api/employees
// @desc    Get all employees (Super Admin only)
// @access  Private/Admin
router.get("/", protect, requireRoleOrPermission("employee"), async (req, res) => {
    try {
        const employees = await User.find({ role: "employee" }).select("-password");
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   PUT /api/employees/:id
// @desc    Update employee permissions (Super Admin only)
// @access  Private/Admin
router.put("/:id", protect, requireRoleOrPermission("employee"), async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (employee && employee.role === "employee") {
            employee.permissions = req.body.permissions || employee.permissions;

            const updatedEmployee = await employee.save();

            res.json({
                _id: updatedEmployee._id,
                name: updatedEmployee.name,
                email: updatedEmployee.email,
                role: updatedEmployee.role,
                permissions: updatedEmployee.permissions,
            });
        } else {
            res.status(404).json({ message: "Employee not found or is not an employee role" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// @route   DELETE /api/employees/:id
// @desc    Delete an employee (Super Admin only)
// @access  Private/Admin
router.delete("/:id", protect, requireRoleOrPermission("employee"), async (req, res) => {
    try {
        const employee = await User.findById(req.params.id);

        if (employee && employee.role === "employee") {
            await employee.deleteOne();
            res.json({ message: "Employee removed successfully" });
        } else {
            res.status(404).json({ message: "Employee not found or is not an employee role" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
