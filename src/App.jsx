import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import MyOrders from './pages/MyOrders';
import OrderDetail from './pages/OrderDetail';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';
import Team from './pages/admin/Team';
import Orders from './pages/admin/Orders';
import Settings from './pages/admin/Settings';
import IntroReveal from './components/IntroReveal';
import { Toaster } from 'react-hot-toast';
import './App.css';

function App() {
  return (
    <IntroReveal>
      <div className="App">
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public Routes with Navbar */}
          <Route element={<><Navbar /><main><Outlet /></main></>}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/collections" element={<ProductListing pageTitle="ALL COLLECTIONS" />} />
            <Route path="/new-arrivals" element={<ProductListing pageTitle="NEW ARRIVALS" filterType="new" />} />
            <Route path="/sale" element={<ProductListing pageTitle="SALE" filterType="sale" />} />
            <Route path="/luxury" element={<ProductListing pageTitle="LUXURY" />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderDetail />} />
            </Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="team" element={<Team />} />
            <Route path="orders" element={<Orders />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<div style={{ padding: '2rem' }}><h2>Admin Page Not Found</h2></div>} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<><Navbar /><main><div style={{ padding: '100px', textAlign: 'center' }}><h2>Page Not Found</h2></div></main></>} />
        </Routes>
      </div>
    </IntroReveal>
  );
}

export default App;
