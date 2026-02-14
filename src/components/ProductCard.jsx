import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const { title, price, image, category, isNew, id } = product;
    const [isHovered, setIsHovered] = useState(false);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.stopPropagation();
        // Default to first size/color if available, or generic defaults
        const defaultSize = product.sizes ? product.sizes[0] : 'M';
        const defaultColor = product.colors ? product.colors[0] : 'Black';

        addToCart(product, defaultSize, defaultColor);
        alert(`Added ${title} to cart!`);
    };

    const handleNavigate = () => {
        navigate(`/product/${id}`);
    };

    return (
        <div
            className="product-card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleNavigate}
            style={{ cursor: 'pointer' }}
        >
            <div className="product-card__image-container">
                <img src={image} alt={title} className="product-card__image" />
                {isNew && <span className="product-badge">NEW DROP</span>}

                <div className={`product-card__actions ${isHovered ? 'visible' : ''}`}>
                    <button className="action-btn" aria-label="Add to Wishlist">
                        <Heart size={20} />
                    </button>
                    <button className="action-btn" aria-label="Quick View">
                        <Eye size={20} />
                    </button>
                </div>

                <button
                    className={`add-to-cart-btn ${isHovered ? 'visible' : ''}`}
                    onClick={handleAddToCart}
                >
                    <ShoppingBag size={18} /> ADD TO CART
                </button>
            </div>

            <div className="product-card__info">
                <span className="product-category">{category}</span>
                <h3 className="product-title">{title}</h3>
                <p className="product-price">₹{price.toLocaleString()}</p>
            </div>
        </div>
    );
};

export default ProductCard;
