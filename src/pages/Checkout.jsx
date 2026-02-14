import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/order.api';
import Button from '../components/Button';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [shippingInfo, setShippingInfo] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
        phone: ''
    });
    const [loading, setLoading] = useState(false);

    const subtotal = getCartTotal();
    const shipping = subtotal > 1000 ? 0 : 100;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    const handleChange = (e) => {
        setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Fetch user address on mount
    React.useEffect(() => {
        if (user && user.address) {
            // Check if address is a string or object (depending on backend user model)
            // Assuming simplified for now, or if backend store full structure
            // If backend stores address as string:
            if (typeof user.address === 'string') {
                setShippingInfo(prev => ({ ...prev, address: user.address }));
            } else if (typeof user.address === 'object') {
                setShippingInfo(prev => ({
                    ...prev,
                    address: user.address.street || '',
                    city: user.address.city || '',
                    postalCode: user.address.zipCode || '',
                    country: user.address.country || 'India',
                    phone: user.phone || ''
                }));
            }
        }
    }, [user]);

    const handleCheckout = async (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert("Your cart is empty");
            return;
        }

        setLoading(true);

        try {
            // 1. Load Razorpay SDK
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load. Check your internet connection.');
                setLoading(false);
                return;
            }

            // 2. Create Order on Backend
            const { data } = await orderApi.checkout({
                shippingInfo
            });

            if (!data.success) {
                alert('Order creation failed');
                setLoading(false);
                return;
            }

            const { order, paymentOrder } = data;

            // 3. Open Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: paymentOrder.amount,
                currency: paymentOrder.currency,
                name: "Pahunn",
                description: "Purchase from Pahunn",
                image: "/logo.png",
                order_id: paymentOrder.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await orderApi.verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            clearCart();
                            navigate(`/order-success?orderId=${order._id}`);
                        } else {
                            alert('Payment Verification Failed');
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Payment Verification API Failed');
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: shippingInfo.phone
                },
                theme: {
                    color: "#6C5CE7"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response) {
                alert(response.error.description);
            });

        } catch (error) {
            console.error(error);
            // Handle specific stock errors if backend returns them in a specific format
            // e.g. error.response.data.error = "Product X is out of stock"
            const errorMsg = error.response?.data?.error || 'Checkout failed';
            alert(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-checkout container">
            <h1>CHECKOUT</h1>

            <div className="checkout-grid">
                {/* Left: Form */}
                <div className="checkout-form">
                    <form id="checkout-form" onSubmit={handleCheckout}>
                        <section>
                            <h2>Shipping Information</h2>
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={shippingInfo.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="123 Street Name"
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        value={shippingInfo.postalCode}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        value={shippingInfo.country}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleChange}
                                        required
                                        placeholder="+91..."
                                    />
                                </div>
                            </div>
                        </section>
                    </form>
                </div>

                {/* Right: Summary */}
                <div className="checkout-summary">
                    <h2>ORDER SUMMARY</h2>
                    <div className="summary-items">
                        {cartItems.map(item => (
                            <div key={`${item.id}-${item.size}`} className="summary-item">
                                <img src={item.image} alt={item.title} />
                                <div className="summary-item-info">
                                    <h4>{item.title}</h4>
                                    <p>{item.quantity} x ₹{item.price.toLocaleString()}</p>
                                    <p>{item.size} / {item.color}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="checkout-totals">
                        <div className="total-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        <div className="total-row">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                        </div>
                        <div className="total-row">
                            <span>Tax (18%)</span>
                            <span>₹{tax.toLocaleString()}</span>
                        </div>
                        <div className="total-row final">
                            <span>Total</span>
                            <span>₹{total.toLocaleString()}</span>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        type="submit"
                        form="checkout-form"
                        disabled={loading}
                        style={{ marginTop: '2rem' }}
                    >
                        {loading ? 'PROCESSING...' : 'PAY NOW'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
