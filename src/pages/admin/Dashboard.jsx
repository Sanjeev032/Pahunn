import React, { useState, useEffect } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import { TrendingUp, Package, AlertCircle, DollarSign, ShoppingBag } from 'lucide-react';
import { orderApi } from '../../api/order.api';
import Skeleton from '../../components/ui/Skeleton';
import './Dashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await orderApi.getStats();
                if (res.data.success) {
                    setStats(res.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const COLORS = ['#00C49F', '#FFBB28', '#FF8042', '#0088FE', '#FF8042'];

    if (loading) {
        return (
            <div className="admin-dashboard">
                <header className="dashboard-header"><Skeleton width="300px" height="40px" /></header>
                <div className="kpi-grid">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} height="120px" borderRadius="12px" />)}
                </div>
                <div className="charts-grid">
                    <Skeleton height="350px" borderRadius="12px" />
                    <Skeleton height="350px" borderRadius="12px" />
                </div>
            </div>
        );
    }

    if (!stats) return <div>Error loading stats.</div>;

    // Format sales graph data for Recharts
    const salesGraphData = stats.salesGraph.map(item => ({
        name: item._id, // Date
        sales: item.sales,
        orders: item.count
    }));

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <h1>Dashboard Overview</h1>
                <p>Detailed inventory and sales analytics</p>
            </header>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon money"><DollarSign size={24} /></div>
                    <div className="kpi-info">
                        <h3>Total Revenue</h3>
                        <p>₹{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon sales"><ShoppingBag size={24} /></div>
                    <div className="kpi-info">
                        <h3>Total Orders</h3>
                        <p>{stats.totalOrders}</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon stock"><Package size={24} /></div>
                    <div className="kpi-info">
                        <h3>Total Inventory</h3>
                        <p>{stats.totalStock} Units ({stats.totalProducts} Products)</p>
                    </div>
                </div>
                <div className="kpi-card">
                    <div className="kpi-icon alert"><AlertCircle size={24} /></div>
                    <div className="kpi-info">
                        <h3>Low Stock Alerts</h3>
                        <p>{stats.lowStockItems} Items</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Sales Trend (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={salesGraphData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} name="Revenue (₹)" />
                            <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#82ca9d" name="Orders" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <h3>Sales by Category</h3>
                    {stats.categorySales.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats.categorySales}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="sales"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {stats.categorySales.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                            No sales data yet
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
