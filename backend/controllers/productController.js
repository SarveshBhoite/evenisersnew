const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Get all products (Public)
exports.getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: category.toLowerCase().trim() } : {};
    
    // Explicitly select fields to ensure 'included' and 'setupTime' are sent
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// @desc    Get single product by ID
exports.getProductById = async (req, res) => {
  try {
    // .lean() is the secret here. It makes sure all fields 
    // like 'included' are converted to plain text for the frontend.
    const product = await Product.findById(req.params.id).lean();

    if (!product) return res.status(404).json({ message: "Package not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create Product (Admin Only)
exports.createEvent = async (req, res) => {
  try {
    // Destructure everything from body to ensure clean data
    const { name, price, category, description, setupTime, included } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const product = new Product({
      name,
      price: Number(price),
      category: category.toLowerCase().trim(),
      description,
      setupTime: setupTime || "", // Fallback to empty string if missing
      included: included || "",   // Fallback to empty string if missing
      image: `/uploads/${req.file.filename}`,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update Product (Admin Only)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 1. Check if product exists
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2. Destructure fields from body to ensure we capture 'included' and 'setupTime'
    const { name, price, category, description, setupTime, included } = req.body;

    // 3. Prepare the update object
    let updateFields = {
      name,
      description,
      setupTime,
      included,
      price: price ? Number(price) : product.price,
      category: category ? category.toLowerCase().trim() : product.category
    };

    // 4. Handle Image if a new one is uploaded
    if (req.file) {
      updateFields.image = `/uploads/${req.file.filename}`;
    }

    // 5. Execute Update
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    console.log("Product Updated Successfully:", updatedProduct); // Check your server terminal
    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete Product (Admin Only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete operation failed" });
  }
};