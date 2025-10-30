// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Mock Products
let products = [
  { id: 'p1', name: 'Vibe T-Shirt', price: 499 },
  { id: 'p2', name: 'Vibe Hoodie', price: 1299 },
  { id: 'p3', name: 'Vibe Cap', price: 299 },
  { id: 'p4', name: 'Vibe Mug', price: 199 },
  { id: 'p5', name: 'Vibe Sticker Pack', price: 99 },
];

let cart = [];

// ------------------- ROUTES ------------------- //

// Get all products
app.get('/api/products', (req, res) => res.json(products));

// Get cart contents
app.get('/api/cart', (req, res) => {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  res.json({ items: cart, total });
});

// Add item to cart
app.post('/api/cart', (req, res) => {
  const { productId, qty = 1 } = req.body;
  const product = products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existing = cart.find((c) => c.productId === productId);
  if (existing) existing.qty += qty;
  else
    cart.push({
      id: uuidv4(),
      productId,
      name: product.name,
      price: product.price,
      qty,
    });

  res.json({ success: true });
});

// Remove item from cart
app.delete('/api/cart/:id', (req, res) => {
  cart = cart.filter((c) => c.id !== req.params.id);
  res.json({ success: true });
});

// Update cart item quantity
app.post('/api/cart/update', (req, res) => {
  const { id, qty } = req.body;
  const item = cart.find((c) => c.id === id);
  if (item) item.qty = qty;
  res.json({ success: true });
});

// Checkout - return mock receipt with Order ID
app.post('/api/checkout', (req, res) => {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const timestamp = new Date().toLocaleString();
  const orderId = uuidv4().slice(0, 8).toUpperCase(); // short order ID
  cart = []; // clear cart after checkout

  res.json({ orderId, total, timestamp });
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
