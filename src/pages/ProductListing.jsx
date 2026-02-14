import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductStore } from '../store/productStore';
import ProductCard from '../components/ProductCard';
import Skeleton from '../components/ui/Skeleton';
import FilterSystem from '../components/FilterSystem';
import { SlidersHorizontal } from 'lucide-react';
import './ProductListing.css';

const ProductListing = ({ pageTitle = "ALL COLLECTIONS", filterType }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Derived state from URL
    const category = searchParams.getAll('category');
    const price = searchParams.getAll('price');
    const size = searchParams.getAll('size');
    const color = searchParams.getAll('color');
    const sort = searchParams.get('sort') || '';
    const page = parseInt(searchParams.get('page')) || 1;

    const activeFilters = {
        category,
        price,
        size,
        color
    };

    const {
        products,
        loading,
        fetchProducts,
        pagination
    } = useProductStore();

    useEffect(() => {
        const params = {};

        // Base filters
        if (filterType === 'new') params.sort = '-createdAt';
        if (filterType === 'sale') params.price = { lte: 5000 };

        // URL filters override base if present
        if (sort) params.sort = sort;
        if (page > 1) params.page = page;

        if (category.length) params.category = category.join(',');
        if (size.length) params.size = size.join(',');
        if (color.length) params.color = color.join(',');

        // Price logic - combining multiple ranges is tricky for backend key-value 
        // We will take the broadest range if multiple selected, or just last one.
        // Or better: simplified logic, if multiple selected, we ignore (or logical OR which api might not support).
        // Let's support single range or "broadest". 
        // For simplicity: handle known strings.

        let priceGte = 0;
        let priceLte = 1000000;

        if (price.length > 0) {
            // If multiple selected, we construct a range that covers all?
            // E.g. Under 1000 + Over 10000 -> not possible to express in simple price[gte]/[lte]
            // Let's just iterate and expand the range.

            let min = 1000000;
            let max = 0;

            price.forEach(p => {
                if (p === 'Under ₹1000') { min = Math.min(min, 0); max = Math.max(max, 1000); }
                if (p === '₹1000 - ₹5000') { min = Math.min(min, 1000); max = Math.max(max, 5000); }
                if (p === '₹5000 - ₹10000') { min = Math.min(min, 5000); max = Math.max(max, 10000); }
                if (p === 'Over ₹10000') { min = Math.min(min, 10000); max = 1000000; }
            });

            if (min !== 1000000) params['price[gte]'] = min;
            if (max !== 0 && max !== 1000000) params['price[lte]'] = max;
        }

        fetchProducts(params);
        // Scroll to top on fetch?
        // window.scrollTo(0, 0); 
    }, [searchParams, filterType, fetchProducts]);

    const handleFilterChange = (section, value) => {
        const newParams = new URLSearchParams(searchParams);
        const currentValues = newParams.getAll(section);

        if (currentValues.includes(value)) {
            newParams.delete(section);
            currentValues.filter(v => v !== value).forEach(v => newParams.append(section, v));
        } else {
            newParams.append(section, value);
        }

        // Reset page on filter change
        newParams.delete('page');

        setSearchParams(newParams);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set('sort', value);
        } else {
            newParams.delete('sort');
        }
        setSearchParams(newParams);
    };

    return (
        <div className="page-plp container">
            {/* Header */}
            <div className="plp-header">
                <div>
                    <h1 className="plp-title">{pageTitle}</h1>
                    <p className="plp-subtitle">{pagination?.total || 0} Items</p>
                </div>

                <div className="plp-controls">
                    <button
                        className="filter-toggle-btn"
                        onClick={() => setIsFilterOpen(true)}
                    >
                        <SlidersHorizontal size={20} /> FILTERS
                    </button>

                    <div className="sort-dropdown">
                        <select onChange={handleSortChange} value={sort}>
                            <option value="">Sort by: Featured</option>
                            <option value="-createdAt">Newest Arrivals</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="plp-layout">
                {/* Sidebar Filters */}
                <FilterSystem
                    isMobileOpen={isFilterOpen}
                    onClose={() => setIsFilterOpen(false)}
                    activeFilters={activeFilters}
                    onFilterChange={handleFilterChange}
                />

                {/* Product Grid */}
                <div className="product-grid">
                    {loading ? (
                        [...Array(8)].map((_, i) => (
                            <div key={i} style={{ marginBottom: '2rem' }}>
                                <Skeleton height="300px" width="100%" borderRadius="8px" />
                                <Skeleton height="20px" width="60%" style={{ marginTop: '10px' }} />
                                <Skeleton height="20px" width="40%" style={{ marginTop: '5px' }} />
                            </div>
                        ))
                    ) : products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                            <h3>No products found</h3>
                            <p>Try adjusting your filters</p>
                            <button
                                className="btn btn--outline"
                                onClick={() => setSearchParams(new URLSearchParams())}
                                style={{ marginTop: '1rem' }}
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="pagination" style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem' }}>
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.set('page', pagination.page - 1);
                                setSearchParams(newParams);
                            }}
                            className="btn btn--outline btn--sm"
                        >
                            Previous
                        </button>
                        <span style={{ alignSelf: 'center' }}>Page {pagination.page} of {pagination.pages}</span>
                        <button
                            disabled={pagination.page === pagination.pages}
                            onClick={() => {
                                const newParams = new URLSearchParams(searchParams);
                                newParams.set('page', pagination.page + 1);
                                setSearchParams(newParams);
                            }}
                            className="btn btn--outline btn--sm"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductListing;
