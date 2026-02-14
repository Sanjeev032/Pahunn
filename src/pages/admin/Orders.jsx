import React, { useState, useEffect } from 'react';
import { Eye, Calendar, CheckCircle, Clock, Truck, XCircle, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../api/order.api';
import Skeleton from '../../components/ui/Skeleton';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [updating, setUpdating] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await orderApi.getAllOrders();
            if (res.data.success) {
                setOrders(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        if (!window.confirm(`Update order status to ${newStatus}?`)) return;

        setUpdating(id);
        try {
            const res = await orderApi.updateStatus(id, newStatus);
            if (res.data.success) {
                setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus: newStatus } : o));
            }
        } catch (error) {
            console.error("Update failed", error);
            alert("Failed to update status");
        } finally {
            setUpdating(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_payment': return 'status-pending';
            case 'processing': return 'status-processing'; // if used
            case 'paid': return 'status-paid';
            case 'packed': return 'status-packed';
            case 'shipped': return 'status-shipped';
            case 'delivered': return 'status-delivered';
            case 'cancelled': return 'status-cancelled';
            case 'refunded': return 'status-refunded';
            default: return '';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending_payment':
            case 'processing': return <Clock size={16} />;
            case 'paid': return <CheckCircle size={16} />;
            case 'packed': return <Clock size={16} />;
            case 'shipped': return <Truck size={16} />;
            case 'delivered': return <CheckCircle size={16} />;
            case 'cancelled':
            case 'refunded': return <XCircle size={16} />;
            default: return null;
        }
    };

    const filteredOrders = orders.filter(o => {
        if (filter === 'All') return true;
        // Map UI filter to Backend status if needed, or just match string logic
        // Let's assume filter matches status string or part of it
        return o.orderStatus.toLowerCase().includes(filter.toLowerCase().replace(' ', '_'));
    });

    if (loading) {
        return (
            <div className="orders-page">
                <header className="page-header">
                    <Skeleton width="200px" height="40px" />
                </header>
                <div className="orders-table-container" style={{ background: 'white', padding: '1rem' }}>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
                            <Skeleton width="100px" height="20px" />
                            <Skeleton width="150px" height="20px" />
                            <Skeleton width="100px" height="20px" />
                            <Skeleton width="100%" height="20px" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <header className="page-header">
                <div>
                    <h1>Orders</h1>
                    <p>Manage and track customer orders</p>
                </div>
            </header>

            <div className="orders-filters">
                {['All', 'Paid', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                    <button
                        key={status}
                        className={`filter-tab ${filter === status ? 'active' : ''}`}
                        onClick={() => setFilter(status)}
                    >
                        {status}
                    </button>
                ))}
            </div>

            <div className="orders-table-container">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order._id}>
                                <td className="order-id">#{order._id.slice(-8).toUpperCase()}</td>
                                <td className="customer-cell">
                                    <div className="customer-avatar">{order.user?.name?.charAt(0) || 'U'}</div>
                                    <div>
                                        <div>{order.user?.name || 'Unknown'}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#888' }}>{order.user?.email}</div>
                                    </div>
                                </td>
                                <td>
                                    <div className="date-cell">
                                        <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString()}
                                    </div>
                                </td>
                                <td>{order.orderItems.length} Items</td>
                                <td className="order-total">₹{order.totalPrice.toLocaleString()}</td>
                                <td>
                                    <span className={`status-badge ${getStatusColor(order.orderStatus)}`}>
                                        {getStatusIcon(order.orderStatus)}
                                        {order.orderStatus.replace('_', ' ')}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <Link to={`/order/${order._id}`} className="icon-btn" title="View Details">
                                            <Eye size={18} />
                                        </Link>

                                        <div className="status-dropdown-wrapper">
                                            <select
                                                className="status-select"
                                                value={order.orderStatus}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                disabled={updating === order._id}
                                            >
                                                <option value="pending_payment">Pending Payment</option>
                                                <option value="paid">Paid</option>
                                                <option value="packed">Packed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
