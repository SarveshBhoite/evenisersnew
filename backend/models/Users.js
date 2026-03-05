const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: false },
    email: { type: String, required: false, unique: true, sparse: true }, // Sparse allows multiple users WITHOUT emails
    password: { type: String, required: false },
    googleId: { type: String, required: false, unique: true, sparse: true },
    phone: { type: String, required: false, unique: true, sparse: true },
    authProvider: {
      type: String,
      enum: ["local", "google", "mobile"],
      default: "local",
    },
    role: {
      type: String,
      enum: ["user", "admin", "employee"],
      default: "user",
    },
    permissions: {
      type: [String],
      default: []
    },

    // 🚨 NEW FIELDS (For Profile & Checkout)
    // Checkout details
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String },

    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);