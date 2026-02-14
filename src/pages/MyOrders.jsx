import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/order.api';
import './MyOrders.css';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await orderApi.getMyOrders();
                if (res.data.success) {
                    setOrders(res.data.data);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return <div className="container" style={{ paddingTop: '4rem', textAlign: 'center' }}>Loading orders...</div>;
    }

    return (
        <div className="page-my-orders container">
            <h1>MY ORDERS</h1>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <Link to="/collections">
                        <button className="btn btn-primary" style={{ marginTop: '1rem' }}>Start Shopping</button>
                    </Link>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <Link to={`/order/${order._id}`} key={order._id} className="order-card-link">
                            <div className="order-card">
                                <div className="order-header">
                                    <div>
                                        <div className="order-id">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</div>
                                        <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <div className={`order-status ${order.orderStatus}`}>
                                        {order.orderStatus.replace('_', ' ')}
                                    </div>
                                </div>
                                <div className="order-body">
                                    <div className="order-previews">
                                        {order.orderItems.slice(0, 4).map((item, idx) => (
                                            <img key={idx} src={item.image} alt={item.title} title={item.title} />
                                        ))}
                                        {order.orderItems.length > 4 && (
                                            <div style={{
                                                width: 50, height: 50, background: 'rgba(0,0,0,0.05)',
                                                borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '0.9rem', fontWeight: 600
                                            }}>
                                                +{order.orderItems.length - 4}
                                            </div>
                                        )}
                                    </div>
                                    <div className="order-total">
                                        <span>Total Amount</span>
                                        <strong>₹{order.totalPrice.toLocaleString()}</strong>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
