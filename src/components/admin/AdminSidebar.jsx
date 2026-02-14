import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingBag, Settings, LogOut, Users, Home } from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__logo">
                <h2>PAHUNN<span>.admin</span></h2>
            </div>

            <nav className="admin-sidebar__nav">
                <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </NavLink>
                <NavLink to="/admin/inventory" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <Package size={20} />
                    <span>Inventory</span>
                </NavLink>
                <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <ShoppingBag size={20} />
                    <span>Orders</span>
                </NavLink>
                <NavLink to="/admin/team" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <Users size={20} />
                    <span>Team</span>
                </NavLink>
                <NavLink to="/admin/settings" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={20} />
                    <span>Settings</span>
                </NavLink>
            </nav>

            <div className="admin-sidebar__footer">
                <br />
                <NavLink to="/" className="admin-nav-item" style={{ marginBottom: '0.5rem', color: '#aeff00' }}>
                    <Home size={20} />
                    <span>Back to Store</span>
                </NavLink>
                <button className="admin-logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
