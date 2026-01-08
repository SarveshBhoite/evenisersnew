const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware"); 
const { 
    getProducts, 
    getProductById, 
    createEvent, 
    updateProduct, 
    deleteProduct ,
    createProductReview
} = require("../controllers/productController");

// --- PUBLIC ROUTES ---
// GET /api/products
router.get("/", getProducts);
// GET /api/products/:id
router.get("/:id", getProductById);

// --- ADMIN ROUTES (Protected) ---
// Note: We use upload.array("images", 10) to allow multiple files.
// This matches the frontend: data.append("images", file)
router.post("/events", protect, admin, upload.array("images", 10), createEvent); 

router.put("/events/:id", protect, admin, upload.array("images", 10), updateProduct);

router.delete("/events/:id", protect, admin, deleteProduct);

router.post("/:id/reviews", protect, createProductReview);

module.exports = router;