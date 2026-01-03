const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const upload = require("../middleware/uploadMiddleware");

// @desc    Get all products (Admin List)
// @route   GET /api/admin/products
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch admin inventory" });
  }
});

router.get("/:id", protect, admin, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
});

// @desc    Create product
// @route   POST /api/admin/products
// backend/routes/adminProductRouts.js

router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    // Log this to see what is actually arriving from the frontend
    console.log("Data received:", req.body);
    console.log("File received:", req.file);

    const { name, price, category, description, included, setupTime, countInStock } = req.body;

    // 1. Check for required fields manually to provide better error messages
    if (!name || !price || !category || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const product = new Product({
      name,
      price: Number(price),
      category,
      description,
      included,
      setupTime,
      countInStock: Number(countInStock) || 0,
      image: `/uploads/${req.file.filename}`,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);

  } catch (error) {
    console.error("Creation Error:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update product
// @route   PUT /api/admin/products/:id
router.put("/:id", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { name, price, category, description, included, setupTime, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.name = name || product.name;
    product.price = price ? Number(price) : product.price;
    product.category = category || product.category;
    product.description = description || product.description;
    product.included = included || product.included;
    product.setupTime = setupTime || product.setupTime;
    product.countInStock = countInStock ? Number(countInStock) : product.countInStock;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted from inventory" });
  } catch (error) {
    res.status(500).json({ message: "Delete operation failed" });
  }
});

module.exports = router;