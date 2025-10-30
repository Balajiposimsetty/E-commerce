import React, { useEffect, useState } from 'react';
import {
  fetchProducts,
  fetchCart,
  addToCart,
  removeCartItem,
  updateCartItem,
  checkout,
} from './api';
import './index.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    // Clean product names (remove "Vibe" if any)
    fetchProducts().then((data) => {
      const cleaned = data.map((p) => ({
        ...p,
        name: p.name.replace(/Vibe\s*/gi, '').trim(),
      }));
      setProducts(cleaned);
    });
    fetchCart().then(setCart);
  }, []);

  const handleAdd = async (id) => {
    await addToCart(id);
    const updated = await fetchCart();
    setCart(updated);
  };

  const handleRemove = async (id) => {
    await removeCartItem(id);
    const updated = await fetchCart();
    setCart(updated);
  };

  const handleQtyChange = async (id, qty) => {
    await updateCartItem(id, qty);
    const updated = await fetchCart();
    setCart(updated);
  };

  const handleCheckout = async (form) => {
    const res = await checkout(cart.items);
    if (res && res.orderId) {
      setReceipt({
        orderId: res.orderId,
        total: res.total,
        timestamp: res.timestamp,
      });
    }
    setShowCheckout(false);
    const cleared = await fetchCart();
    setCart(cleared);
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <h2 className="logo">🛍️ MyCart</h2>
        <div className="cart-summary">
          <span>{cart.items.length} items</span>
          <span>Total: ₹{cart.total}</span>
        </div>
      </header>

      <main className="content">
        <section className="products-section">
          <h3>Products</h3>
          <div className="products-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">
                <h4>{p.name}</h4>
                <p className="price">₹{p.price}</p>
                <button className="btn-add" onClick={() => handleAdd(p.id)}>
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="cart-section">
          <h3>Your Cart</h3>
          {cart.items.length === 0 && <p>No items in cart.</p>}
          {cart.items.map((it) => (
            <div key={it.id} className="cart-item">
              <div className="item-info">
                <strong>{it.name}</strong>
                <span>₹{it.price}</span>
              </div>
              <div className="item-actions">
                <input
                  type="number"
                  min="1"
                  value={it.qty}
                  onChange={(e) =>
                    handleQtyChange(it.id, Number(e.target.value))
                  }
                />
                <button className="btn-remove" onClick={() => handleRemove(it.id)}>
                  Remove
                </button>
              </div>
              <div className="subtotal">Subtotal: ₹{it.price * it.qty}</div>
            </div>
          ))}
          {cart.items.length > 0 && (
            <>
              <hr />
              <div className="cart-total">Total: ₹{cart.total}</div>
              <button className="btn-checkout" onClick={() => setShowCheckout(true)}>
                Proceed to Checkout
              </button>
            </>
          )}
        </section>
      </main>

      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} onSubmit={handleCheckout} />
      )}

      {receipt && <ReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}

function CheckoutModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Checkout</h3>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn-submit"
            onClick={() => onSubmit({ name, email })}
            disabled={!name || !email}
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

function ReceiptModal({ receipt, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Order Receipt</h3>
        <p>Thank you for shopping with us!</p>
        <p><strong>Order ID:</strong> {receipt.orderId}</p>
        <p><strong>Total:</strong> ₹{receipt.total}</p>
        <p><strong>Time:</strong> {receipt.timestamp}</p>
        <button className="btn-submit" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default App;
