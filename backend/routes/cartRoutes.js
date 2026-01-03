const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const { protect } = require("../middleware/authMiddleware");
const mongoose = require("mongoose");
const cartController = require("../controllers/cartController");

// @desc    Get logged-in user's cart
// @desc    Get logged-in user's cart
router.get("/", protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("items.productId");
    
    // Always return an object with an "items" array to match frontend logic
    if (!cart) {
      return res.json({ items: [] }); 
    }
    return res.json({ items: cart.items }); // ✅ Changed from res.json(cart)
  } catch (err) {
    console.error("GET Cart Error:", err);
    return res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Add item to cart or update quantity
router.post("/", protect, async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Valid Product ID is required" });
  }

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId
      );
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        cart.items.push({ productId, quantity: Number(quantity) });
      }
      await cart.save();
    } else {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ productId, quantity: Number(quantity) }],
      });
    }

    const populatedCart = await Cart.findById(cart._id).populate("items.productId");
    
    // ✅ Consistency fix: return { items: ... }
    return res.status(200).json({ items: populatedCart.items });

  } catch (error) {
    console.error("DATABASE ERROR:", error);
    return res.status(500).json({ message: "Failed to add to cart" });
  }
});

// Ensure the parameter name is :productId
router.delete("/:productId", protect, cartController.removeFromCart);

// @desc    Update item quantity
router.put("/:productId", protect, async (req, res) => {
  const { quantity } = req.body;
  const { productId } = req.params;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.json({ items: [] });

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = Number(quantity);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.productId"
    );

    return res.json({ items: populatedCart.items });
  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    return res.status(500).json({ message: "Failed to update cart" });
  }
});

module.exports = router;