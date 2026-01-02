const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { sendOrderEmail } = require("../utils/sendEmail");

exports.createOrder = async (req, res) => {
  try {
    const { userEmail, items, shippingAddress, totalAmount } = req.body;

    const order = new Order({
      user: req.user._id, 
      userEmail,
      items, 
      shippingAddress,
      totalAmount,
    });

    const savedOrder = await order.save();
    console.log("✅ Order saved to Database:", savedOrder._id);

    // 1. Send success to frontend immediately
    res.status(201).json(savedOrder);

    // 2. Handle background tasks without blocking
    setImmediate(async () => {
        try {
            await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });
            await sendOrderEmail(savedOrder);
            console.log("✅ Background tasks complete");
        } catch (err) {
            console.error("⚠️ Background error:", err.message);
        }
    });

  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error.message);
    if (!res.headersSent) {
        res.status(500).json({ message: "Order failed", error: error.message });
    }
  }
};

// CUSTOMER → MY ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your orders" });
  }
};

// ADMIN → ALL ORDERS
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 }); // Newest orders first
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin orders" });
  }
};