const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { 
          type: Number, 
          required: true, 
          default: 1 
        },
        // --- NEW FIELDS ---
        eventDate: { type: String }, // Saved as YYYY-MM-DD
        timeSlot: { type: String },  // Saved as "09:00 AM - 12:00 PM"
        message: { type: String },   // Custom message for the decorator
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Cart || mongoose.model("Cart", cartSchema);