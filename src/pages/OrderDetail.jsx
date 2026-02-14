import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../api/order.api';
import Button from '../components/Button';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await orderApi.getById(id);
                if (res.data.success) {
                    setOrder(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) return;

        setCancelling(true);
        try {
            const res = await orderApi.cancel(id);
            if (res.data.success) {
                setOrder(res.data.data);
                alert("Order cancelled successfully");
            }
        } catch (error) {
            alert(error.response?.data?.error || "Failed to cancel order");
        } finally {
            setCancelling(false);
        }
    };

    if (loading) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading...</div>;
    if (!order) return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Order not found</div>;

    const steps = ['placed', 'paid', 'packed', 'shipped', 'delivered'];
    const currentStepIndex = steps.indexOf(order.orderStatus);
    const isCancelled = order.orderStatus === 'cancelled' || order.orderStatus === 'refunded';

    return (
        <div className="page-order-detail container">
            <div className="order-detail-header">
                <Link to="/my-orders" className="back-link">
                    <ArrowLeft size={16} /> Back to Orders
                </Link>
                <div className="order-meta">
                    <h1>Order #{order._id.slice(-8).toUpperCase()}</h1>
                    <span className={`status-badge ${order.orderStatus}`}>
                        {order.orderStatus.replace('_', ' ').toUpperCase()}
                    </span>
                </div>
                <p className="order-date">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Timeline */}
            {!isCancelled && (
                <div className="order-timeline">
                    {steps.map((step, index) => (
                        <div key={step} className={`timeline-step ${index <= currentStepIndex ? 'active' : ''}`}>
                            <div className="step-icon">
                                {step === 'placed' && <Clock size={16} />}
                                {step === 'paid' && <CheckCircle size={16} />}
                                {step === 'packed' && <Package size={16} />}
                                {step === 'shipped' && <Truck size={16} />}
                                {step === 'delivered' && <CheckCircle size={16} />}
                            </div>
                            <span className="step-label">{step.toUpperCase()}</span>
                        </div>
                    ))}
                </div>
            )}

            {isCancelled && (
                <div className="cancelled-banner">
                    <XCircle size={24} />
                    This order has been cancelled.
                </div>
            )}

            <div className="order-content-grid">
                <div className="order-items-section">
                    <h2>Items</h2>
                    <div className="items-list">
                        {order.orderItems.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                                <img src={item.image} alt={item.title} />
                                <div className="item-info">
                                    <h3>{item.title}</h3>
                                    <p>{item.variant?.size} / {item.variant?.color}</p>
                                </div>
                                <div className="item-qty">x{item.quantity}</div>
                                <div className="item-price">₹{(item.price * item.quantity).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="order-summary-section">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{order.totalPrice - order.shippingPrice - order.taxPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>₹{order.shippingPrice}</span>
                    </div>
                    <div className="summary-row">
                        <span>Tax</span>
                        <span>₹{order.taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{order.totalPrice.toLocaleString()}</span>
                    </div>

                    <div className="shipping-address">
                        <h3>Shipping Address</h3>
                        <p>{order.shippingInfo.address}</p>
                        <p>{order.shippingInfo.city}, {order.shippingInfo.postalCode}</p>
                        <p>{order.shippingInfo.country}</p>
                        <p>Phone: {order.shippingInfo.phone}</p>
                    </div>

                    {!isCancelled && (order.orderStatus === 'pending_payment' || order.orderStatus === 'paid' || order.orderStatus === 'packed') && (
                        <Button
                            variant="outline"
                            fullWidth
                            className="cancel-btn"
                            onClick={handleCancel}
                            disabled={cancelling}
                        >
                            {cancelling ? 'Cancelling...' : 'Cancel Order'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
