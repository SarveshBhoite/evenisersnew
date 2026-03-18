const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }],
  image: { type: String, required: true },
  category: {
    type: String,
    lowercase: true,
    trim: true,
    enum: ['wedding', 'anniversary', 'haldi-mehandi', 'birthday', 'corporate', 'babywelcome', 'namingceremony', 'romantic', 'babyshower', 'bridetobe', 'agedtoperfection', 'festival','engagement','housewarming','annaprashan', 'catering', 'games'], 
    required: true,
    index: true
  },
  description: { type: String, default: "" },
  theme: { type: String, default: "", index: true }, // Index added for performance
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
  ],
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
}, { timestamps: true });

eventSchema.index({ createdAt: -1 }); // Faster sorting for getProducts

// Export ONE name consistently
module.exports = mongoose.models.Product || mongoose.model("Product", eventSchema);