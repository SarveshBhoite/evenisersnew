const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const path = require("path");
const fs = require("fs");

// Models
const connectDB = require("./config/db");
const User = require("./models/Users"); // Ensure filename matches (User.js vs Users.js)
const Product = require("./models/Product");
const Order = require("./models/Order");

// Data
const products = require("./data/products");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Global Defaults
const GLOBAL_FAQS = [
  {
    question: "Is electricity required?",
    answer: "Yes, a standard plug point is required nearby."
  },
  {
    question: "What is your cancellation policy?",
    answer: "Cancellations made 48 hours in advance are eligible for a 50% refund."
  }
];

// 3. Upload Function
const uploadToCloud = async (filename) => {
  try {
    // Look inside backend/data/images
    const filePath = path.join(__dirname, "data", "images", filename);
    
    if (!fs.existsSync(filePath)) {
      console.error(`⚠️  File not found: ${filename}`);
      return ""; // Return empty string if missing
    }

    const result = await cloudinary.uploader.upload(filePath, {
      folder: "evenisers",
    });
    
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Upload Failed for ${filename}:`, error.message);
    return "";
  }
};

const importData = async () => {
  try {
    console.log("🔥 Starting Bulk Migration...");

    // A. Find Admin by Role
    const adminUser = await User.findOne({ role: "admin" });

    if (!adminUser) {
        console.error("❌ No user with role 'admin' found!");
        process.exit(1);
    }
    console.log(`👤 Linked to Admin: ${adminUser.name}`);

    // B. Clear Old Products
    await Product.deleteMany();
    console.log("🧹 Old Products Cleared.");

    // C. Process Products
    console.log(`📦 Processing ${products.length} products...`);
    
    const sampleProducts = [];

    for (const product of products) {
      
      // Upload Image
      let cloudUrl = "";
      if (product.image) {
        process.stdout.write(`   ⬆️  Uploading ${product.image}... `); 
        cloudUrl = await uploadToCloud(product.image);
        if(cloudUrl) console.log("Done ✅");
        else console.log("Skipped ⚠️");
      }

      // Build Object
      sampleProducts.push({
        ...product,
        user: adminUser._id,
        image: cloudUrl || "/placeholder.svg", 
        faqs: GLOBAL_FAQS,
        careInfo: "Keep away from sharp objects,Do not use water nearby",
        category: product.category ? product.category.toLowerCase() : "birthday",
      });
    }

    // D. Insert
    await Product.insertMany(sampleProducts);

    console.log("✅ All Data Imported Successfully!");
    process.exit();
    
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();