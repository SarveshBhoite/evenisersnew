const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");

// Models
const Product = require("./models/Product");
const User = require("./models/Users");

dotenv.config();

// 1. Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Global Defaults
const GLOBAL_FAQS = [
  {
    question: "What services do you provide?",
    answer: "We offer complete event planning, decoration, entertainment, catering, photography, and venue arrangements.",
  },
  {
    question: "Which cities do you serve?",
    answer: "We started in Pune and now provide services across multiple cities in India.",
  },
  {
    question: "Do you offer customized decorations?",
    answer: "Yes, we provide theme-based and fully customized decoration services.",
  },
  {
    question: "Do you manage complete events?",
    answer: "Yes, we provide both decoration-only and full event management services.",
  },
  {
    question: "How early should I book my event?",
    answer: "We recommend booking at least 4 days days in advance.",
  },
  {
    question: "How much does event planning cost?",
    answer: "Pricing depends on event type, theme, and services required. We offer customized packages.",
  },
];

const DEFAULT_CARE_INFO = "Keep away from sharp objects, Do not use water nearby";

// 3. Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("🔌 MongoDB Connected"))
  .catch((err) => {
    console.error("❌ DB Error:", err);
    process.exit(1);
  });

// 4. Helper: Smart Image Finder
const findImageFile = (category, filename) => {
    if (!filename) return null;
    
    // Check in data/[category]/[filename]
    const basePath = path.join(__dirname, "data", category);
    const originalPath = path.join(basePath, filename);

    if (fs.existsSync(originalPath)) return originalPath;

    // Try swapping extension
    const ext = path.extname(filename);
    const nameWithoutExt = path.basename(filename, ext);
    const altExt = ext === ".png" ? ".jpg" : ".png";
    const altPath = path.join(basePath, `${nameWithoutExt}${altExt}`);

    if (fs.existsSync(altPath)) return altPath;
    return null;
};

const importAllData = async () => {
  try {
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
        throw new Error("❌ No user with role 'admin' found!");
    }
    console.log(`👤 Linking products to Admin: ${adminUser.name}`);

    const dataDir = path.join(__dirname, "data");
    const files = fs.readdirSync(dataDir).filter(f => f.endsWith(".js"));

    console.log(`📂 Found ${files.length} category files.`);

    for (const file of files) {
      const categoryName = path.basename(file, ".js");
      const productData = require(path.join(dataDir, file));
      
      console.log(`\n--- 📂 SEEDING CATEGORY: ${categoryName.toUpperCase()} (${productData.length} items) ---`);

      for (const item of productData) {
        const cloudFolder = `evenizers/${categoryName}`;
        let finalImageUrl = item.image;

        const imagePath = findImageFile(categoryName, item.image);
        if (imagePath && !item.image.startsWith("http")) {
          console.log(`📸 Uploading image for [${item.name}]...`);
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
        }

        const productPayload = {
            ...item,
            user: adminUser._id,
            image: finalImageUrl,
            faqs: (item.faqs && item.faqs.length > 0) ? item.faqs : GLOBAL_FAQS,
            careInfo: (item.careInfo && item.careInfo.length > 0) ? item.careInfo : DEFAULT_CARE_INFO,
            category: item.category ? item.category.toLowerCase() : categoryName
        };

        const existingProduct = await Product.findOne({ name: item.name });
        if (existingProduct) {
          Object.assign(existingProduct, productPayload);
          await existingProduct.save();
          console.log(`   🔄 UPDATED: ${item.name}`);
        } else {
          await Product.create(productPayload);
          console.log(`   ✅ CREATED: ${item.name}`);
        }
      }
    }

    console.log("\n🎉 ALL DATA PROCESSED SUCCESSFULLY!");
    process.exit();

  } catch (error) {
    console.error(`❌ Critical Error: ${error.message}`);
    process.exit(1);
  }
};

importAllData();
