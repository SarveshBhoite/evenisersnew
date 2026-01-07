const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { protect, admin } = require("../middleware/authMiddleware");

// ✅ CUSTOMER: Create Order (Using the controller now!)
router.post("/", protect, orderController.createOrder);

// ✅ CUSTOMER: Get My Orders
router.get("/myorders", protect, orderController.getMyOrders);

// ✅ ADMIN: Get All Orders
router.get("/", protect, admin, orderController.getAllOrders);

// 🚨 NEW ROUTE: Assign Vendor
// router.route("/:id/assign").put(protect, admin, orderController.assignOrder);
router.route("/:id/broadcast").put(protect, admin, orderController.broadcastOrder);
router.route("/:id/status").put(protect, admin, orderController.updateOrderStatus);
module.exports = router;