import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import ProductGallery from '../components/ProductGallery';
import Button from '../components/Button';
import { Heart, Truck, ShieldCheck, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { addToCart } = useCart();
    const { id } = useParams();
    const { currentProduct, loading, fetchProduct } = useProductStore();

    // Fetch product on mount
    useEffect(() => {
        if (id) {
            fetchProduct(id);
        }
    }, [id, fetchProduct]);

    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    // Update local state when product loads
    useEffect(() => {
        if (currentProduct && currentProduct.variants && currentProduct.variants.length > 0) {
            // Default to first variant's size/color if available
            // but usually we let user pick.
            // Let's pick first unique size and color.
            // Simplified:
            // setSelectedSize(currentProduct.variants[0].size); // optional
        }
    }, [currentProduct]);

    if (loading || !currentProduct) {
        return <div className="container" style={{ padding: '4rem' }}>Loading...</div>;
    }

    const product = currentProduct;
    // Map backend data to UI format if needed.
    // Backend product: { title, price, description, images: [{url}], variants: [{size, color, stock}] }
    // UI expects: product.images (array of strings), product.sizes (array), product.colors (array)
    // We can compute derived values.

    const images = product.images.map(img => img.url);
    const sizes = [...new Set(product.variants.map(v => v.size))];
    const colors = [...new Set(product.variants.map(v => v.color))];

    const handleAddToCart = () => {
        addToCart(product, selectedSize, selectedColor);
        alert('Added to cart!'); // Simple feedback for now
    };

    return (
        <div className="page-pdp container">
            <div className="pdp-layout">
                <div className="pdp-gallery">
                    <ProductGallery images={images} />
                </div>

                <div className="pdp-info">
                    <div className="pdp-header">
                        <h1 className="pdp-title">{product.title}</h1>
                        <p className="pdp-price">₹{(product.finalPrice || product.price).toLocaleString()}</p>
                    </div>

                    <p className="pdp-description">{product.description}</p>

                    <div className="pdp-selectors">
                        <div className="selector-group">
                            <label>COLOR</label>
                            <div className="color-options">
                                {colors.map(color => (
                                    <button
                                        key={color}
                                        className={`color-btn ${selectedColor === color ? 'active' : ''}`}
                                        style={{ backgroundColor: color }}
                                        onClick={() => setSelectedColor(color)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="selector-group">
                            <label>SIZE</label>
                            <div className="size-options">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                                        onClick={() => setSelectedSize(size)}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="pdp-actions">
                        <Button variant="primary" fullWidth size="lg" onClick={handleAddToCart}>ADD TO CART</Button>
                        <button className="wishlist-btn">
                            <Heart size={24} />
                        </button>
                    </div>

                    <div className="pdp-meta">
                        <div className="meta-item">
                            <Truck size={20} />
                            <span>Free shipping on orders over ₹5,000</span>
                        </div>
                        <div className="meta-item">
                            <ShieldCheck size={20} />
                            <span>30-day easy returns</span>
                        </div>
                        <div className="meta-item">
                            <Share2 size={20} />
                            <span>Share this product</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
