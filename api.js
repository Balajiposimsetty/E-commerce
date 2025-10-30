// src/api.js
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) throw new Error('Failed fetching products');
  return res.json();
}

export async function fetchCart() {
  const res = await fetch(`${API_BASE}/api/cart`);
  if (!res.ok) throw new Error('Failed fetching cart');
  return res.json();
}

export async function addToCart(productId, qty = 1) {
  const res = await fetch(`${API_BASE}/api/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to add to cart');
  }
  return res.json();
}

export async function removeCartItem(id) {
  const res = await fetch(`${API_BASE}/api/cart/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete');
  return res.json();
}

export async function updateCartItem(id, qty) {
  const res = await fetch(`${API_BASE}/api/cart/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ qty })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to update');
  }
  return res.json();
}

export async function checkout(cartItems, name, email) {
  const res = await fetch(`${API_BASE}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems, name, email })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Checkout failed');
  }
  return res.json();
}
