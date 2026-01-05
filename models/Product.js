const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  image: { type: String, required: true },
  category: {
    type: String,
    lowercase: true, // This solves your Anniversary vs anniversary problem!
    trim: true,
    enum: ['wedding', 'anniversary', 'haldi', 'birthday', 'corporate', 'reception'], 
    required: true
  },
  description: { type: String, required: true },
  theme: { type: String },// Saved as "item1, item2, item3"
  setupTime: { type: String },
  included: { type: String ,default: "" }, 
  notIncluded: { type: String, default: "" },
  isAvailable: { type: Boolean, default: true },
  discount: { type: Number, default: 0 }, // Percentage (e.g., 10 for 10%)
  careInfo: { type: String, default: "" }, // Care instructions
  faqs: [
    {
      question: { type: String },
      answer: { type: String }
    }
  ]
}, { timestamps: true });

// Export ONE name consistently
module.exports = mongoose.models.Product || mongoose.model("Product", eventSchema);