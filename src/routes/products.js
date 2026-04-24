const express = require('express');
const router = express.Router();
const products = require('../data/products.json');

// GET /api/products - return all products
router.get('/', (req, res) => {
  const { category, sort } = req.query;

  let result = [...products];

  if (category && category !== 'All') {
    result = result.filter(p => p.category === category);
  }

  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);

  res.json({ success: true, count: result.length, products: result });
});

// GET /api/products/:id - return single product
router.get('/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, product });
});

module.exports = router;
