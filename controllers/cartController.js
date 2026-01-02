const Cart = require("../models/Cart");
const mongoose = require("mongoose");

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    // 1. Validate ID format to prevent a backend crash
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    // 2. Atomically remove the item using $pull
    const updatedCart = await Cart.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { productId: productId } } },
      { new: true } // Return the cart AFTER the item is removed
    ).populate("items.productId");

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 3. Send back only the items array to match your frontend expectation
    return res.status(200).json({ items: updatedCart.items });

  } catch (error) {
    // 🚨 Check your VS Code terminal for this specific log!
    console.error("DELETE CONTROLLER ERROR:", error.message);
    return res.status(500).json({ message: "Server error removing item" });
  }
};