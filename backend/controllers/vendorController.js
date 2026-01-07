const Vendor = require("../models/Vendor");

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
    
    // Case-insensitive city filter
    if (city) {
        query.city = { $regex: city, $options: "i" };
    }

    const vendors = await Vendor.find(query).sort({ createdAt: -1 });
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors" });
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