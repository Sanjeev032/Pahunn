import React from 'react';
import './AuthLayout.css';

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-page">
            <div className="auth-container glass-panel">
                <h2 className="auth-title">{title}</h2>
                {subtitle && <p className="auth-subtitle">{subtitle}</p>}
                <div className="auth-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
