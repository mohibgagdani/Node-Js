const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  console.log('Received product:', req.body);
  const product = new Product({
    name: req.body.name,
    price: req.body.price
  });
  try {
    const newProduct = await product.save();
    console.log('Product saved:', newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;