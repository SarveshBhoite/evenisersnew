const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const vendorController = require("../controllers/vendorController");

// Base Route: /api/vendors
router.route("/")
    .post(protect, vendorController.addVendor) // Add Vendor
    .get(protect, vendorController.getVendors); // Get Vendors (with ?city= query)

router.post("/accept", vendorController.acceptOrder);
router.get("/details/:orderId", vendorController.getPublicOrderDetails); 
router.route("/:id")
    .delete(protect, vendorController.deleteVendor);

module.exports = router;