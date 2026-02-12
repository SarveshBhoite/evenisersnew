const Product = require("../models/Product");
const Order = require("../models/Order");
const cloudinary = require("cloudinary").v2; // ✅ Import Cloudinary
const fs = require("fs"); // ✅ Import FS for cleaning up temp files

// ✅ Configure Cloudinary (Make sure .env has these keys)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- PUBLIC CONTROLLERS ---

// @desc Get All Products (Filter & Search)
exports.getProducts = async (req, res) => {
  try {
    const { category, search, theme } = req.query; // Added theme to query
    let filter = {};

    if (category) filter.category = category.toLowerCase().trim();
    if (theme) filter.theme = { $regex: theme, $options: "i" }; // Filter by theme if provided
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { theme: { $regex: search, $options: "i" } } // Allow searching by theme
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
    // 1. Extract Fields (Added theme)
    const { 
        name, price, category, theme, description, setupTime, 
        included, notIncluded, discount, careInfo, faqs 
    } = req.body;

    // 2. Handle Cloudinary Upload
    let imagePaths = [];
    
    // Determine folder name based on category
    const cleanCategory = category ? category.toLowerCase().replace(/\s+/g, '') : 'general';
    const cloudFolder = `evenisers/${cleanCategory}`;

    if (req.files && req.files.length > 0) {
        // Upload all files in parallel
        const uploadPromises = req.files.map(file => {
            return cloudinary.uploader.upload(file.path, {
                folder: cloudFolder,
                use_filename: true,
                unique_filename: false
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        
        // Map results to secure URLs
        imagePaths = uploadResults.map(result => result.secure_url);

        // Optional: Delete local temp files after upload to save space
        req.files.forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
    }

    if (imagePaths.length === 0) {
        return res.status(400).json({ message: "At least one image is required" });
    }

    // 3. Parse JSON fields
    let parsedFaqs = [];
    if (faqs) {
        try { parsedFaqs = JSON.parse(faqs); } catch (e) { parsedFaqs = []; }
    }

    const product = new Product({
      name,
      price: Number(price),
      category: category.toLowerCase().trim(),
      theme: theme || "", // ✅ Save Theme
      description,
      setupTime: setupTime || "",
      included: included || "",
      notIncluded: notIncluded || "",
      
      // Images Logic:
      images: imagePaths, 
      image: imagePaths[0], // Main Image

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
        name, price, category, theme, description, setupTime, 
        included, notIncluded, discount, careInfo, faqs, 
        existingImages // List of images kept
    } = req.body;

    let updateFields = {
      name, description, setupTime, included, notIncluded, careInfo,
      theme: theme || "", // ✅ Update Theme
      price: price ? Number(price) : product.price,
      discount: discount ? Number(discount) : product.discount,
      category: category ? category.toLowerCase().trim() : product.category,
    };

    // 1. Parse FAQs
    if (faqs) {
        try { updateFields.faqs = JSON.parse(faqs); } catch (e) {}
    }

    // 2. IMAGE LOGIC (Cloudinary)
    
    // A. Identify kept images
    let keptImages = [];
    if (existingImages) {
        try {
            keptImages = JSON.parse(existingImages);
        } catch (e) {
            keptImages = []; 
        }
    }

    // B. Upload New Images to Cloudinary
    let newImages = [];
    if (req.files && req.files.length > 0) {
        const cleanCategory = updateFields.category.replace(/\s+/g, '');
        const cloudFolder = `evenisers/${cleanCategory}`;

        const uploadPromises = req.files.map(file => {
            return cloudinary.uploader.upload(file.path, {
                folder: cloudFolder
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        newImages = uploadResults.map(result => result.secure_url);

        // Cleanup local files
        req.files.forEach(file => {
            if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
    }

    // C. Combine
    const finalImageArray = [...keptImages, ...newImages];
    updateFields.images = finalImageArray;

    // D. Update Main Image
    if (finalImageArray.length > 0) {
        updateFields.image = finalImageArray[0];
    } else {
        updateFields.image = ""; 
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(400).json({ message: error.message });
  }
};

// @desc Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    
    // Optional: Delete images from Cloudinary here if strict cleanup is needed
    // But getting public_ids from URLs requires parsing, usually fine to keep them or clean via cron job.

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};

exports.createProductReview = async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this event." });
    }

    const hasOrdered = await Order.findOne({
        user: req.user._id,
        "items.product": req.params.id,
        status: "completed"
    });

    if (!hasOrdered) {
        return res.status(400).json({ message: "You can only review events you have completed." });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};