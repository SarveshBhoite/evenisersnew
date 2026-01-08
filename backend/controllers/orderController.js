const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Vendor = require("../models/Vendor");
const { sendVendorBroadcast } = require("../utils/sendEmail");
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
    const { vendorId } = req.query; // 1. Get the ID from the URL (?vendorId=...)
    
    // 2. Build a filter object
    let query = {};
    if (vendorId) {
        // If we have an ID, only look for orders assigned to this person
        query.assignedVendor = vendorId; 
    }

    // 3. Use the filter in .find(query)
    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name category")
      .populate("assignedVendor", "name phone")
      .sort({ createdAt: -1 }); // Newest first
      
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

    // 1. Update DB
    order.status = "broadcasting";
    order.broadcastTo = vendorIds;
    await order.save();

    // 2. Fetch Vendor Emails
    const vendors = await Vendor.find({ _id: { $in: vendorIds } });

    // 3. Send Emails in Background
    setImmediate(async () => {
        try {
            const promises = vendors.map(v => {
                // Generate Magic Link
                // CHANGE 'http://localhost:3000' to your real domain in production
                const link = `${process.env.CLIENT_URL || "http://localhost:3000"}/vendor/accept?orderId=${order._id}&vendorId=${v._id}`;
                return sendVendorBroadcast(v.email, v.name, order, link);
            });
            await Promise.all(promises);
            console.log(`📧 Sent ${vendors.length} broadcast emails.`);
        } catch (err) {
            console.error("Email Broadcast Error:", err);
        }
    });
    
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

    if (status === "completed" && order.remainingAmount > 0) {
        console.log(`💰 Auto-settling payment for Order ${order._id}`);
        order.amountPaid = order.totalAmount; // Mark full amount as paid
        order.remainingAmount = 0;            // Clear dues
    }
    if (status === "cancelled" && order.remainingAmount > 0) {
        console.log(`💰 Adding advance payment for Order ${order._id} to total revenue`);
        order.remainingAmount = 0;            // Clear dues
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