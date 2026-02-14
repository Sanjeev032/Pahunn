import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();

    const subtotal = getCartTotal();
    const shipping = 0; // Free
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="page-cart container empty-cart">
                <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
                    <h2>Your cart is empty</h2>
                    <p style={{ margin: '1rem 0 2rem' }}>Looks like you haven't added anything yet.</p>
                    <Link to="/collections">
                        <Button variant="primary">START SHOPPING</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="page-cart container">
            <div className="cart-header">
                <h1>YOUR CART ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h1>
                <Link to="/collections" className="continue-shopping">
                    <ArrowLeft size={16} /> Continue Shopping
                </Link>
            </div>

            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={`${item.id}-${item.size}-${item.color}`} className="cart-item">
                            <div className="cart-item__image">
                                {/* Handled both single image string and array of images */}
                                <img
                                    src={Array.isArray(item.images) ? item.images[0] : item.image}
                                    alt={item.title}
                                />
                            </div>
                            <div className="cart-item__details">
                                <h3><Link to={`/product/${item.id}`}>{item.title}</Link></h3>
                                <p className="cart-item__meta">{item.color} / {item.size}</p>
                                <div className="cart-item__actions">
                                    <div className="quantity-selector">
                                        <button onClick={() => updateQuantity(item.id, item.size, item.color, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, item.size, item.color, 1)}>+</button>
                                    </div>
                                    <button
                                        className="remove-btn"
                                        onClick={() => removeFromCart(item.id, item.size, item.color)}
                                    >
                                        <Trash2 size={16} /> Remove
                                    </button>
                                </div>
                            </div>
                            <div className="cart-item__price">
                                ₹{(item.price * item.quantity).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>ORDER SUMMARY</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{total.toLocaleString()}</span>
                    </div>

                    <Link to="/checkout" style={{ display: 'block', marginTop: '1.5rem' }}>
                        <Button variant="primary" fullWidth size="lg">CHECKOUT</Button>
                    </Link>
                    <div className="cart-security">
                        Secure Checkout - SSL Encrypted
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
