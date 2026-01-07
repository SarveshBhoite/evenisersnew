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
      .populate("assignedVendor", "name") 
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching admin orders" });
  }
};

// 🚨 NEW: Assign Order to Vendor
exports.broadcastOrder = async (req, res) => {
  try {
    const { vendorIds } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "broadcasting";
    order.broadcastTo = vendorIds;
    await order.save();

    console.log(`📡 Broadcasted Order ${order._id} to vendors:`, vendorIds);
    // Ideally send emails here
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Broadcast failed" });
  }
};

// 🚨 NEW: Manual Status Update
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // If Admin takes over manually
    if (status === "in_progress" && !order.assignedVendor) {
        order.broadcastTo = [];
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Update failed" });
  }
};

// exports.assignOrder = async (req, res) => {
//   try {
//     const { vendorId } = req.body;
//     const order = await Order.findById(req.params.id);

//     if (order) {
//       order.assignedVendor = vendorId;
      
//       // Update status to 'in_progress' automatically when assigned
//       if (order.status === "paid" || order.status === "partial_paid") {
//           order.status = "in_progress";
//       }
      
//       const updatedOrder = await order.save();
      
//       // Ideally: Send Email/SMS to Vendor here
//       console.log(`✅ Order ${order._id} assigned to Vendor ${vendorId}`);
      
//       res.json(updatedOrder);
//     } else {
//       res.status(404).json({ message: "Order not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Assignment failed", error: error.message });
//   }
// };