const Product = require("../models/Product");

// --- PUBLIC CONTROLLERS ---

// @desc Get All Products (Filter & Search)
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};

    if (category) filter.category = category.toLowerCase().trim();
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// @desc Get Single Product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --- ADMIN CONTROLLERS ---

// @desc Create Product
exports.createEvent = async (req, res) => {
  try {
    // 1. Extract Fields (Removed countInStock)
    const { 
        name, price, category, description, setupTime, 
        included, notIncluded, discount, careInfo, faqs 
    } = req.body;

    // 2. Handle Images
    // We expect 'req.files' from the upload.array() middleware
    let imagePaths = [];
    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map(file => `/uploads/${file.filename}`);
    } 
    // Fallback if someone uses single file upload logic
    else if (req.file) {
        imagePaths.push(`/uploads/${req.file.filename}`);
    }

    if (imagePaths.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
    }

    // 3. Parse JSON fields (FAQs come as string via FormData)
    let parsedFaqs = [];
    if (faqs) {
        try { parsedFaqs = JSON.parse(faqs); } catch (e) { parsedFaqs = []; }
    }

    const product = new Product({
      name,
      price: Number(price),
      category: category.toLowerCase().trim(),
      description,
      setupTime: setupTime || "",
      included: included || "",
      notIncluded: notIncluded || "",
      
      // Images Logic:
      // 'images' gets the full array
      images: imagePaths, 
      // 'image' gets the first image (Thumbnail) to satisfy required: true in schema
      image: imagePaths[0],

      // New Fields
      discount: Number(discount) || 0,
      careInfo: careInfo || "",
      faqs: parsedFaqs
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Create Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc Update Product
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { 
        name, price, category, description, setupTime, 
        included, notIncluded, discount, careInfo, faqs 
    } = req.body;

    let updateFields = {
      name, description, setupTime, included, notIncluded, careInfo,
      price: price ? Number(price) : product.price,
      discount: discount ? Number(discount) : product.discount,
      category: category ? category.toLowerCase().trim() : product.category,
    };

    if (faqs) {
        try { updateFields.faqs = JSON.parse(faqs); } catch (e) {}
    }

    // Handle New Images (Append to existing)
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => `/uploads/${file.filename}`);
      updateFields.images = [...(product.images || []), ...newImages];
      
      // If the main image was deleted or empty, set the new first image as main
      if (!product.image) {
          updateFields.image = newImages[0];
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};