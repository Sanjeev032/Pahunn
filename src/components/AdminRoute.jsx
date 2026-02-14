import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh'
            }}>
                <div className="spinner"></div>
            </div>
        );
    }

    if (!user || user.role !== 'admin') {
        // If not logged in or not admin, redirect to home
        return <Navigate to="/" replace />;
    }

    return children ? children : <Outlet />;
};

export default AdminRoute;
