const express = require("express")
const { protect, admin } = require("../middleware/authMiddleware")
const Product = require("../models/Product")
const Order = require("../models/Order")
const upload = require("../middleware/uploadMiddleware");
const router = express.Router()

// PRODUCTS
router.post("/events", protect, admin, upload.single("image"), async (req, res) => {
  try {
    // This extracts all the fields from the FormData
    const { name, price, description, category, included, setupTime } = req.body;
    
    const decoration = await Product.create({
      name,
      price,
      description,
      category,
      included,
      setupTime,
      image: req.file ? `/uploads/${req.file.filename}` : "" 
    });

    res.status(201).json(decoration);
  } catch (error) {
    res.status(400).json({ message: "Make sure all fields are filled!" });
  }
});

router.put("/events/:id", protect, admin, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updated)
})

router.delete("/events/:id", protect, admin, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ message: "Event deleted" })
})

// ORDERS
router.get("/orders", protect, admin, async (req, res) => {
  const orders = await Order.find().populate("user")
  res.json(orders)
})

module.exports = router
