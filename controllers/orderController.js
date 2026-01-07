const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { sendOrderEmail } = require("../utils/sendEmail");

exports.createOrder = async (req, res) => {
  try {
    const { 
        userEmail, items, shippingAddress, 
        totalAmount, amountPaid, paymentType // New Fields
    } = req.body;

    const orderItems = items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.price,
        eventDate: item.eventDate || "",
        timeSlot: item.timeSlot || "",
        message: item.message || ""
    }));

    // Logic: Set status based on Payment Type
    let initialStatus = "pending";
    if (paymentType === "advance") {
        initialStatus = "partial_paid";
    } else if (paymentType === "full") {
        initialStatus = "paid";
    }

    const order = new Order({
      user: req.user._id, 
      userEmail,
      items: orderItems,
      shippingAddress,
      
      // Payment Calculations
      totalAmount: Number(totalAmount),
      amountPaid: Number(amountPaid),
      remainingAmount: Number(totalAmount) - Number(amountPaid),
      paymentType,
      status: initialStatus 
    });

    const savedOrder = await order.save();
    console.log("✅ Order created:", savedOrder._id);

    res.status(201).json(savedOrder);

    // Background tasks
    setImmediate(async () => {
        try {
            await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });
            await sendOrderEmail(savedOrder);
        } catch (err) {
            console.error("Background error:", err.message);
        }
    });

  } catch (error) {
    console.error("❌ Order Error:", error.message);
    if (!res.headersSent) {
        res.status(500).json({ message: "Order failed", error: error.message });
    }
  }
};

// ... Keep your getMyOrders and getAllOrders logic exactly as they were ...
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name image") 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your orders" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name category") 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin orders" });
  }
};