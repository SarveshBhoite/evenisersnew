const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String, required: true }, // Key for filtering
    address: { type: String },
    serviceType: { type: String, default: "General Decorator" },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);