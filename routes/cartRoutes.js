const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");
const cartController = require("../controllers/cartController");

// @desc    Get logged-in user's cart
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.productId");
    
    if (!cart) {
      return res.json({ items: [] }); 
    }
    return res.json({ items: cart.items });
  } catch (err) {
    console.error("GET Cart Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Add item to cart
router.post("/", protect, cartController.addToCart);

// @desc    Update item (Quantity OR Details like Date/Time)
// 🚨 This uses the controller function which allows partial updates
router.put("/:productId", protect, cartController.updateCartItem);

// @desc    Remove item from cart
router.delete("/:productId", protect, cartController.removeFromCart);

module.exports = router;