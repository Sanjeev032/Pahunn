import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import './SearchModal.css';

import { PRODUCTS } from '../data/products';

const SUGGESTIONS = ['Cargo Pants', 'New Arrivals', 'Oversized Hoodie', 'Accessories', 'Black Jacket'];

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const results = useMemo(() => {
        if (query.trim().length <= 1) return [];

        const lowerQuery = query.toLowerCase();
        return PRODUCTS.filter(product =>
            product.title.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery)
        );
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="search-modal">
            <div className="search-modal__overlay" onClick={onClose}></div>
            <div className="search-modal__content">
                <div className="search-header container">
                    <div className="search-input-wrapper">
                        <Search className="search-icon" size={24} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="search-body container">
                    {query.length === 0 ? (
                        <div className="search-suggestions">
                            <h3>POPULAR SEARCHES</h3>
                            <div className="tags">
                                {SUGGESTIONS.map(tag => (
                                    <button key={tag} onClick={() => setQuery(tag)}>{tag}</button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="search-results">
                            <div className="results-header">
                                <h3>{results.length} RESULTS</h3>
                                {results.length > 0 && <button className="view-all">View All <ArrowRight size={16} /></button>}
                            </div>

                            <div className="results-grid">
                                {results.map(item => (
                                    <div key={item.id} className="search-item">
                                        <img src={item.image} alt={item.title} />
                                        <div className="search-item__info">
                                            <h4>{item.title}</h4>
                                            <p>₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchModal;
