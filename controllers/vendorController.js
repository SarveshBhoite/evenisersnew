const Vendor = require("../models/Vendor");
const Order = require("../models/Order");

// @desc    Add a new Vendor
exports.addVendor = async (req, res) => {
  try {
    const { name, email, phone, city, address, serviceType } = req.body;

    const vendorExists = await Vendor.findOne({ email });
    if (vendorExists) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const vendor = await Vendor.create({
      name, email, phone, city, address, serviceType
    });

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: "Failed to add vendor", error: error.message });
  }
};

// @desc    Get All Vendors (Optional Filter by City)
exports.getVendors = async (req, res) => {
  try {
    const { city } = req.query;
    let query = {};
    if (city) query.city = { $regex: city, $options: "i" };

    // Use .lean() to allow modifying the object
    const vendors = await Vendor.find(query).lean();

    // 🚨 Add History Count
    const vendorsWithStats = await Promise.all(vendors.map(async (v) => {
        const completedCount = await Order.countDocuments({ assignedVendor: v._id, status: "completed" });
        return { ...v, history: { completed: completedCount } };
    }));

    res.json(vendorsWithStats);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors" });
  }
};

// 🚨 NEW: Vendor Accepts Order (Magic Link Logic)
exports.getPublicOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("items.product", "name category image");

        if (!order) return res.status(404).json({ message: "Order not found" });

        // Only send necessary info (Hide Customer Name/Phone until accepted)
        const safeData = {
            _id: order._id,
            city: order.shippingAddress.city,
            eventDate: order.items[0]?.eventDate,
            timeSlot: order.items[0]?.timeSlot,
            message: order.items[0]?.message,
            products: order.items.map(i => ({
                name: i.product.name,
                category: i.product.category,
                image: i.product.image
            })),
            status: order.status
        };

        res.json(safeData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching details" });
    }
};

exports.acceptOrder = async (req, res) => {
    try {
        const { orderId, vendorId } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) return res.status(404).json({ message: "Order not found" });

        if (order.status !== "broadcasting") {
            return res.status(400).json({ message: "This event is already assigned." });
        }

        order.assignedVendor = vendorId;
        order.status = "in_progress"; 
        order.broadcastTo = []; 
        
        await order.save();

        res.json({ success: true, message: "Order assigned to you!", order });
    } catch (error) {
        res.status(500).json({ message: "Error accepting order" });
    }
};

// @desc    Delete Vendor
exports.deleteVendor = async (req, res) => {
    try {
        await Vendor.findByIdAndDelete(req.params.id);
        res.json({ message: "Vendor removed" });
    } catch (error) {
        res.status(500).json({ message: "Delete failed" });
    }
}