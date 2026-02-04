const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Models
const Product = require("./models/Product"); // Ensure this matches your file case (Product vs Products)
const User = require("./models/Users");

// 👇 CHANGE THIS LINE to point to the file you want to seed
const productData = require("./data/babyshower"); 

dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Global Defaults (Used if data file has empty fields)
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

const DEFAULT_CARE_INFO = "Keep away from sharp objects, Do not use water nearby";

// 3. Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔌 MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Error:", err);
    process.exit(1);
  });

// 4. Helper: Smart Image Finder (Handles .jpg vs .png)
const findImageFile = (filename) => {
    if (!filename) return null;
    
    const basePath = path.join(__dirname, "data", "babyshower");
    const originalPath = path.join(basePath, filename);

    if (fs.existsSync(originalPath)) return originalPath;

    // Try swapping extension if exact match fails
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const altExt = ext === ".png" ? ".jpg" : ".png";
    const altPath = path.join(basePath, `${nameWithoutExt}${altExt}`);

    if (fs.existsSync(altPath)) return altPath;
    return null;
};

const importData = async () => {
  try {
    console.log(`🔥 Processing ${productData.length} products...`);

    // A. Find Admin User (Crucial for linking)
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
        throw new Error("❌ No user with role 'admin' found! Cannot seed products without an owner.");
    }
    console.log(`👤 Linking products to Admin: ${adminUser.name}`);

    // B. Loop through data
    for (const item of productData) {
      
      // 1. Determine Cloudinary Folder
      const categoryFolder = item.category ? item.category.toLowerCase().replace(/\s+/g, '') : 'general';
      const cloudFolder = `evenisers/${categoryFolder}`;

      // 2. Handle Image Upload
      let finalImageUrl = item.image; // Default to string if local file missing

      const imagePath = findImageFile(item.image);
      if (imagePath) {
        // Only upload if it's a local file path we found
        console.log(`📸 Uploading image to [${cloudFolder}]...`);
        try {
            const result = await cloudinary.uploader.upload(imagePath, {
                folder: cloudFolder,
                use_filename: true,
                unique_filename: false,
                overwrite: true
            });
            finalImageUrl = result.secure_url;
        } catch (uploadErr) {
            console.error(`⚠️ Upload Failed for ${item.name}:`, uploadErr.message);
        }
      } else if (item.image && !item.image.startsWith("http")) {
          console.log(`⚠️  Image file not found locally: ${item.image}. Keeping string.`);
      }

      // 3. Prepare Data Object (Fill blanks with Defaults)
      const productPayload = {
          ...item,
          user: adminUser._id, // ✅ Link to Admin
          image: finalImageUrl,
          // ✅ Use Global Defaults if specific data is missing/empty
          faqs: (item.faqs && item.faqs.length > 0) ? item.faqs : GLOBAL_FAQS,
          careInfo: (item.careInfo && item.careInfo.length > 0) ? item.careInfo : DEFAULT_CARE_INFO,
          // Ensure category is lowercase
          category: item.category ? item.category.toLowerCase() : "general"
      };

      // 4. UPSERT (Update if exists, Create if new)
      const existingProduct = await Product.findOne({ name: item.name });

      if (existingProduct) {
        // Update existing fields
        Object.assign(existingProduct, productPayload);
        await existingProduct.save();
        console.log(`🔄 UPDATED: ${item.name}`);
      } else {
        // Create new
        await Product.create(productPayload);
        console.log(`✅ CREATED: ${item.name}`);
      }
    }

    console.log("🎉 All Data Processed Successfully!");
    process.exit();

  } catch (error) {
    console.error(`❌ Critical Error: ${error.message}`);
    process.exit(1);
  }
};

importData();