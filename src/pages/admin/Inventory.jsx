import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { productApi } from '../../api/product.api';
import ProductForm from '../../components/admin/ProductForm';
import './Inventory.css';

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await productApi.getAll();
            if (res.data.success) {
                setProducts(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAdd = () => {
        setSelectedProduct(null);
        setShowModal(true);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await productApi.delete(id);
            setProducts(prev => prev.filter(p => p._id !== id)); // Optimistic remove or re-fetch
        } catch (error) {
            console.error("Delete failed", error);
            alert("Failed to delete");
        }
    };

    const handleFormSubmit = async (formData) => {
        try {
            if (selectedProduct) {
                await productApi.update(selectedProduct._id, formData);
            } else {
                await productApi.create(formData);
            }
            setShowModal(false);
            fetchProducts(); // Re-fetch to see updates
        } catch (error) {
            console.error("Save failed", error);
            alert("Failed to save product");
        }
    };

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', class: 'status-out' };
        if (stock < 20) return { label: 'Low Stock', class: 'status-low' };
        return { label: 'In Stock', class: 'status-in' };
    };

    if (loading) return <div>Loading Inventory...</div>;

    return (
        <div className="inventory-page">
            <header className="inventory-header">
                <div>
                    <h1>Inventory Management</h1>
                    <p>Track stock levels and product performance</p>
                </div>
                <button className="add-product-btn" onClick={handleAdd}>+ Add Product</button>
            </header>

            <div className="inventory-controls">
                <div className="search-bar">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="filter-btn">
                    <Filter size={20} /> Filter
                </button>
            </div>

            <div className="inventory-table-container">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => {
                            // Calculate total stock across variants if top-level stock not set
                            const totalStock = product.variants?.reduce((acc, v) => acc + (v.stock || 0), 0) || product.stock || 0;
                            const status = getStockStatus(totalStock);

                            return (
                                <tr key={product._id}>
                                    <td>
                                        <div className="product-cell">
                                            {product.images?.[0] && <img src={product.images[0].url} alt={product.title} />}
                                            <span>{product.title}</span>
                                        </div>
                                    </td>
                                    <td>{product.category}</td>
                                    <td>₹{product.price.toLocaleString()}</td>
                                    <td>{totalStock}</td>
                                    <td>
                                        <span className={`status-badge ${status.class}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="icon-btn" onClick={() => handleEdit(product)} title="Edit">
                                                <Edit size={18} />
                                            </button>
                                            <button className="icon-btn delete" onClick={() => handleDelete(product._id)} title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <ProductForm
                    product={selectedProduct}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default Inventory;
