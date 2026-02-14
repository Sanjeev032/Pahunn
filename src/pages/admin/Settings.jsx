import React from 'react';
import { Save, Bell, Globe, Shield, CreditCard } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    return (
        <div className="settings-page">
            <header className="page-header">
                <div>
                    <h1>Settings</h1>
                    <p>Configure store preferences and admin controls</p>
                </div>
                <button className="save-btn">
                    <Save size={18} /> Save Changes
                </button>
            </header>

            <div className="settings-grid">
                {/* General Settings */}
                <section className="settings-card">
                    <div className="card-header">
                        <Globe size={20} className="card-icon" />
                        <h3>General Settings</h3>
                    </div>
                    <div className="form-group">
                        <label>Store Name</label>
                        <input type="text" defaultValue="Pahunn" />
                    </div>
                    <div className="form-group">
                        <label>Support Email</label>
                        <input type="email" defaultValue="support@pahunn.com" />
                    </div>
                    <div className="form-group">
                        <label>Currency</label>
                        <select defaultValue="INR">
                            <option value="INR">Indian Rupee (₹)</option>
                            <option value="USD">US Dollar ($)</option>
                        </select>
                    </div>
                </section>

                {/* Notifications */}
                <section className="settings-card">
                    <div className="card-header">
                        <Bell size={20} className="card-icon" />
                        <h3>Notifications</h3>
                    </div>
                    <div className="toggle-group">
                        <label className="toggle-label">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                            Email on New Order
                        </label>
                    </div>
                    <div className="toggle-group">
                        <label className="toggle-label">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                            Low Stock Alerts
                        </label>
                    </div>
                    <div className="toggle-group">
                        <label className="toggle-label">
                            <input type="checkbox" />
                            <span className="slider"></span>
                            Weekly Reports
                        </label>
                    </div>
                </section>

                {/* Security */}
                <section className="settings-card">
                    <div className="card-header">
                        <Shield size={20} className="card-icon" />
                        <h3>Security</h3>
                    </div>
                    <div className="form-group">
                        <label>Change Admin Password</label>
                        <input type="password" placeholder="New Password" />
                    </div>
                    <button className="secondary-btn">Enable 2FA</button>
                </section>

                {/* Payment Methods */}
                <section className="settings-card">
                    <div className="card-header">
                        <CreditCard size={20} className="card-icon" />
                        <h3>Payment Gateways</h3>
                    </div>
                    <div className="toggle-group">
                        <label className="toggle-label">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                            Razorpay
                        </label>
                    </div>
                    <div className="toggle-group">
                        <label className="toggle-label">
                            <input type="checkbox" defaultChecked />
                            <span className="slider"></span>
                            Cash on Delivery
                        </label>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
