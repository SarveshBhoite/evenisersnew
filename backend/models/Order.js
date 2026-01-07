const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // This stores the DISCOUNTED price per unit
        
        // Event Details
        eventDate: { type: String },
        timeSlot: { type: String },
        message: { type: String },
      },
    ],
    shippingAddress: {
      firstName: String,
      lastName: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },
    
    // --- PAYMENT & VALUES ---
    totalAmount: { type: Number, required: true }, // The Full Invoice Amount (100%)
    amountPaid: { type: Number, required: true },  // What user paid online (40% or 100%)
    remainingAmount: { type: Number, default: 0 }, // Balance to be paid later
    paymentType: { 
        type: String, 
        enum: ["full", "advance"], 
        default: "full" 
    },

    // --- STATUSES (Updated for Event Workflow) ---
    status: {
      type: String,
      enum: ["pending", "partial_paid", "paid", "broadcasting", "in_progress", "completed", "cancelled"],
      default: "pending",
    },

    assignedVendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", default: null },
    
    // 🚨 NEW: Track broadcasted vendors
    broadcastTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }]
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);