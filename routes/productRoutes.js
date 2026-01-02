const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// @desc    Get all products (with optional category filtering)
// @route   GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    
    // Create a filter object. If category is provided, find by category.
    // Otherwise, find all ({}).
    const queryFilter = category ? { category: category } : {};

    const products = await Product.find(queryFilter).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching products" });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error fetching product" });
  }
});

module.exports = router;