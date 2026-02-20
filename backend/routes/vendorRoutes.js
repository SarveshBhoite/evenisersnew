const express = require("express");
const router = express.Router();
const { protect, admin, requireRoleOrPermission } = require("../middleware/authMiddleware");
const vendorController = require("../controllers/vendorController");

// Base Route: /api/vendors
router.route("/")
    .post(protect, requireRoleOrPermission("vendors"), vendorController.addVendor) // Add Vendor
    .get(protect, requireRoleOrPermission("vendors"), vendorController.getVendors); // Get Vendors (with ?city= query)

router.post("/accept", vendorController.acceptOrder);
router.get("/details/:orderId", vendorController.getPublicOrderDetails);
router.route("/:id")
    .delete(protect, requireRoleOrPermission("vendors"), vendorController.deleteVendor);

module.exports = router;