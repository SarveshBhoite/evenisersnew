const Cart = require("../models/Cart");
const mongoose = require("mongoose");

// @desc    Add Item to Cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ message: "Invalid Product ID" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
      // Check if product exists in cart
      let itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

      if (itemIndex > -1) {
        // Product exists, update quantity
        cart.items[itemIndex].quantity += Number(quantity);
      } else {
        // Product does not exist, push new item
        cart.items.push({ productId, quantity: Number(quantity) });
      }
      cart = await cart.save();
    } else {
      // No cart, create new
      cart = await Cart.create({
        user: userId,
        items: [{ productId, quantity: Number(quantity) }]
      });
    }
    
    // Return populated cart
    const finalCart = await Cart.findOne({ user: userId }).populate("items.productId");
    return res.status(201).json({ items: finalCart.items });

  } catch (err) {
    console.error("Add Cart Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Remove Item from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { productId: productId } } },
      { new: true }
    ).populate("items.productId");

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json({ items: updatedCart.items });

  } catch (error) {
    console.error("Delete Cart Error:", error.message);
    return res.status(500).json({ message: "Server error removing item" });
  }
};

// @desc    Update Item (Quantity OR Details)
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, eventDate, timeSlot, message } = req.body;
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

    if (itemIndex > -1) {
      // 1. Update Quantity if provided
      if (quantity !== undefined) {
          cart.items[itemIndex].quantity = Number(quantity);
      }

      // 2. Update Event Details if provided
      if (eventDate !== undefined) cart.items[itemIndex].eventDate = eventDate;
      if (timeSlot !== undefined) cart.items[itemIndex].timeSlot = timeSlot;
      if (message !== undefined) cart.items[itemIndex].message = message;
      
      await cart.save();
      
      const populatedCart = await Cart.findOne({ user: userId }).populate("items.productId");
      return res.status(200).json({ items: populatedCart.items });
    } else {
      return res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};