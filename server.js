const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes"); // Public
const adminProductRoutes = require("./routes/adminProductRouts"); // Admin Products (with Multer)
const adminRoutes = require("./routes/adminRoutes"); // Admin Orders/General
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  
}));

app.use(express.json());

// 🚨 STATIC FOLDER ACCESS
// This ensures https://evenisersnew.onrender.com/uploads/image.jpg works
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error: ", err));

// 🚨 ROUTE ORDER MATTERS
app.use("/api/auth", authRoutes);
app.use("/api/admin/products", adminProductRoutes); // Move this UP
app.use("/api/admin", adminRoutes); 
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/users", userRoutes);

app.listen(5000, () => console.log("🚀 Server running on https://evenisersnew.onrender.com"));