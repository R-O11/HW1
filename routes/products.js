const express = require('express');
const router = express.Router();
const { products } = require('../data');

// GET /api/products
router.get('/', (req, res) => {
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send('Invalid ID');

  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).send('Product not found');
  res.json(product);
});

// POST /api/products
router.post('/', (req, res) => {
  const { id, name, price, stock } = req.body;

  if (!id || !name || price == null || stock == null) {
    return res.status(400).send('Missing fields');
  }

  if (products.find(p => p.id === id)) {
    return res.status(400).send('Product already exists');
  }

  if (price <= 0 || !Number.isFinite(price)) {
    return res.status(400).send('Invalid price');
  }

  if (!Number.isInteger(stock) || stock < 0) {
    return res.status(400).send('Invalid stock');
  }

  const newProduct = { id, name, price, stock };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT /api/products/:id
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send('Invalid ID');

  const product = products.find(p => p.id === id);
  if (!product) return res.status(404).send('Product not found');

  const { name, price, stock } = req.body;
  if (name) product.name = name;
  if (price != null) {
    if (price <= 0 || !Number.isFinite(price)) return res.status(400).send('Invalid price');
    product.price = price;
  }
  if (stock != null) {
    if (!Number.isInteger(stock) || stock < 0) return res.status(400).send('Invalid stock');
    product.stock = stock;
  }

  res.json(product);
});

// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).send('Invalid ID');

  const index = products.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).send('Product not found');

  products.splice(index, 1);
  res.sendStatus(204);
});

module.exports = router;
