const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// @desc    Get all products (Filter by Category OR Search by Name/Category)
// @route   GET /api/products
router.get("/", async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let queryFilter = {};

    // 1. If Category is provided (exact match)
    if (category) {
      queryFilter.category = category.toLowerCase();
    }

    // 2. If Search Term is provided (Matches Name OR Category)
    if (search) {
      queryFilter.$or = [
        { name: { $regex: search, $options: "i" } },      // Case-insensitive name match
        { category: { $regex: search, $options: "i" } }   // Case-insensitive category match
      ];
    }

    const products = await Product.find(queryFilter).sort({ createdAt: -1 });

    // 🚨 FIX: Send the array directly, NOT an object. 
    // This fixes 'products.map is not a function' error.
    res.json(products); 

  } catch (err) {
    console.error(err);
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