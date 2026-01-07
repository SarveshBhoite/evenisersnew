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
exports.acceptOrder = async (req, res) => {
    try {
        const { orderId, vendorId } = req.body;
        const order = await Order.findById(orderId);
        
        if (!order) return res.status(404).json({ message: "Order not found" });

        // RACE CONDITION CHECK
        if (order.status !== "broadcasting") {
            return res.status(400).json({ message: "This event is already assigned." });
        }

        // Assign
        order.assignedVendor = vendorId;
        order.status = "in_progress";
        order.broadcastTo = []; 
        await order.save();

        res.json({ success: true, message: "You accepted the order!" });
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