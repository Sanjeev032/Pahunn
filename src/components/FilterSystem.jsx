import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import './FilterSystem.css';

const FilterSection = ({ title, options, isOpen, onToggle, selectedValues = [], onChange }) => {
    return (
        <div className="filter-section">
            <button className="filter-header" onClick={onToggle}>
                <span className="filter-title">{title}</span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {isOpen && (
                <div className="filter-options">
                    {options.map((opt, idx) => (
                        <label key={idx} className="filter-checkbox">
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(opt)}
                                onChange={() => onChange(opt)}
                            />
                            <span className="checkmark"></span>
                            {opt}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const FilterSystem = ({ isMobileOpen, onClose, activeFilters = {}, onFilterChange }) => {
    const [openSections, setOpenSections] = useState({
        category: true,
        price: true,
        size: false,
        color: false
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Helper to safely call onChange
    const handleChange = (section, value) => {
        if (onFilterChange) {
            onFilterChange(section, value);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`filter-overlay ${isMobileOpen ? 'visible' : ''}`}
                onClick={onClose}
            ></div>

            <aside className={`filter-sidebar ${isMobileOpen ? 'open' : ''}`}>
                <div className="filter-sidebar__header mobile-only">
                    <h3>FILTERS</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>

                <FilterSection
                    title="CATEGORY"
                    options={['T-Shirts', 'Hoodies', 'Jackets', 'Pants', 'Accessories']}
                    isOpen={openSections.category}
                    onToggle={() => toggleSection('category')}
                    selectedValues={activeFilters.category}
                    onChange={(val) => handleChange('category', val)}
                />

                <FilterSection
                    title="PRICE"
                    options={['Under ₹1000', '₹1000 - ₹5000', '₹5000 - ₹10000', 'Over ₹10000']}
                    isOpen={openSections.price}
                    onToggle={() => toggleSection('price')}
                    selectedValues={activeFilters.price}
                    onChange={(val) => handleChange('price', val)}
                />

                <FilterSection
                    title="SIZE"
                    options={['XS', 'S', 'M', 'L', 'XL', 'XXL']}
                    isOpen={openSections.size}
                    onToggle={() => toggleSection('size')}
                    selectedValues={activeFilters.size}
                    onChange={(val) => handleChange('size', val)}
                />

                <FilterSection
                    title="COLOR"
                    options={['Black', 'White', 'Beige', 'Neon Green', 'Blue']}
                    isOpen={openSections.color}
                    onToggle={() => toggleSection('color')}
                    selectedValues={activeFilters.color}
                    onChange={(val) => handleChange('color', val)}
                />
            </aside>
        </>
    );
};

export default FilterSystem;
