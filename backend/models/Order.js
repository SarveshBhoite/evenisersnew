const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        
        // --- NEW FIELDS ---
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
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);