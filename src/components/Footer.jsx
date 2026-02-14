import React from 'react';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer bg-dark">
            <div className="container footer__container">

                {/* Brand Column */}
                <div className="footer__col footer__brand">
                    <h2 className="footer__logo">PAHUNN</h2>
                    <p className="footer__desc">
                        Redefining streetwear with bold minimalism.
                        Premium quality, limited drops, for the modern urban explorer.
                    </p>
                    <div className="footer__socials">
                        <a href="#" aria-label="Instagram"><Instagram size={20} /></a>
                        <a href="#" aria-label="Twitter"><Twitter size={20} /></a>
                        <a href="#" aria-label="Facebook"><Facebook size={20} /></a>
                    </div>
                </div>

                {/* Shop Column */}
                <div className="footer__col">
                    <h3>Shop</h3>
                    <ul>
                        <li><a href="#">New Arrivals</a></li>
                        <li><a href="#">Best Sellers</a></li>
                        <li><a href="#">Collections</a></li>
                        <li><a href="#">Accessories</a></li>
                        <li><a href="#" className="text-accent">Sale</a></li>
                    </ul>
                </div>

                {/* Support Column */}
                <div className="footer__col">
                    <h3>Support</h3>
                    <ul>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Shipping & Returns</a></li>
                        <li><a href="#">Size Guide</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                {/* Newsletter Column */}
                <div className="footer__col footer__newsletter">
                    <h3>Stay Updated</h3>
                    <p>Subscribe for exclusive drops and early access.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Your email address" required />
                        <button type="submit" aria-label="Subscribe">
                            <ArrowRight size={20} />
                        </button>
                    </form>
                </div>

            </div>
            <div className="footer__bottom container">
                <p>&copy; {new Date().getFullYear()} Pahunn. All rights reserved.</p>
                <div className="footer__legal">
                    <a href="#">Privacy Policy</a>
                    <a href="#">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
