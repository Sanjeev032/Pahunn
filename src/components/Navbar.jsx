import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, X, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

import SearchModal from './SearchModal';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { getCartCount } = useCart();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        document.body.style.overflow = !isMobileMenuOpen ? 'hidden' : 'unset';
    };

    return (
        <>
            <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            <nav className={`navbar ${isScrolled ? 'navbar--scrolled' : ''}`}>
                <div className="container navbar__container">
                    {/* Logo */}
                    <Link to="/" className="navbar__logo">
                        PAHUNN
                    </Link>

                    {/* Desktop Nav */}
                    <div className="navbar__links">
                        <Link to="/new-arrivals" className="nav-link">New Arrivals</Link>
                        <Link to="/collections" className="nav-link">Collections</Link>
                        <Link to="/luxury" className="nav-link">Luxury</Link>
                        <Link to="/admin" className="nav-link" style={{ color: '#aeff00' }}>Admin</Link>
                        <Link to="/sale" className="nav-link nav-link--accent">Sale</Link>
                    </div>

                    {/* Actions */}
                    <div className="navbar__actions">
                        <button
                            className="nav-icon"
                            aria-label="Search"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <Search size={24} />
                        </button>
                        {user ? (
                            <div className="nav-user-menu" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Link to="/my-orders" className="nav-icon hidden-mobile" aria-label="Account" title="My Orders">
                                    <User size={24} />
                                </Link>
                                <button className="nav-icon hidden-mobile" onClick={logout} title="Logout">
                                    <LogOut size={24} />
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="nav-icon hidden-mobile" aria-label="Login">
                                <User size={24} />
                            </Link>
                        )}
                        <Link to="/cart" className="nav-icon cart-icon" aria-label="Cart">
                            <ShoppingBag size={24} />
                            {getCartCount() > 0 && <span className="cart-badge">{getCartCount()}</span>}
                        </Link>
                        <button
                            className="nav-icon hamburger-icon"
                            onClick={toggleMobileMenu}
                            aria-label="Menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'data-open' : ''}`}>
                <div className="mobile-menu__content">
                    <Link to="/new-arrivals" onClick={toggleMobileMenu}>New Arrivals</Link>
                    <Link to="/collections" onClick={toggleMobileMenu}>Collections</Link>
                    <Link to="/luxury" onClick={toggleMobileMenu}>Luxury</Link>
                    <Link to="/sale" className="text-accent" onClick={toggleMobileMenu}>Sale</Link>

                    <div className="mobile-menu__footer">
                        {user ? (
                            <>
                                {user.role === 'admin' && <Link to="/admin" onClick={toggleMobileMenu} style={{ color: '#aeff00', display: 'block', marginBottom: '1rem' }}>Admin Dashboard</Link>}
                                <Link to="/my-orders" onClick={toggleMobileMenu}>My Orders</Link>
                                <button onClick={() => { logout(); toggleMobileMenu(); }} style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
                                <span style={{ margin: '0 10px', color: '#666' }}>|</span>
                                <Link to="/signup" onClick={toggleMobileMenu}>Sign Up</Link>
                            </>
                        )}
                        <p className="mobile-menu__copy">&copy; 2026 Pahunn</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
