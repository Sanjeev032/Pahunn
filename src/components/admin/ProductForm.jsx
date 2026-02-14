import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import Button from '../Button';
import './ProductForm.css';

const ProductForm = ({ product, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        brand: '',
        category: 'Tops',
        price: '',
        discountPrice: '',
        stock: 0, // Fallback for simple stock
        tags: '',
        featured: false,
        newArrival: false,
        sale: false,
    });

    const [variants, setVariants] = useState([]);
    const [images, setImages] = useState([]); // Existing URLs
    const [newImages, setNewImages] = useState([]); // New File objects
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title,
                description: product.description,
                brand: product.brand,
                category: product.category,
                price: product.price,
                discountPrice: product.discountPrice || '',
                stock: 0, // Not used directly if variants exist
                tags: product.tags ? product.tags.join(', ') : '',
                featured: product.featured,
                newArrival: product.newArrival,
                sale: product.sale,
            });
            setVariants(product.variants || []);
            setImages(product.images || []);
        } else {
            // Init defaults
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Variant Logic
    const handleAddVariant = () => {
        setVariants([...variants, { size: 'M', color: 'Black', stock: 10, sku: '' }]);
    };

    const handleVariantChange = (index, field, value) => {
        const newVariants = [...variants];
        newVariants[index][field] = value;
        setVariants(newVariants);
    };

    const handleRemoveVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    // Image Logic
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setNewImages([...newImages, ...files]);
    };

    const handleRemoveNewImage = (index) => {
        setNewImages(newImages.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'tags') {
                // Backend might expect array? or just comma string that backend splits?
                // Let's assume backend parses or we send array. 
                // Mongoose [String] usually handles array. 
                // Let's split it manually if needed, or send as is if backend handles.
                // Safest to send as multiple 'tags' fields if FormData, but express might expect 'tags[]'.
                // Or just send string and backend splits. The model is [String].
                // Let's try sending standard JSON fields as text in FormData.
                data.append(key, formData[key]);
            } else {
                data.append(key, formData[key]);
            }
        });

        // Variants need to be stringified for FormData if complex object
        data.append('variants', JSON.stringify(variants));

        // Images
        newImages.forEach(file => {
            data.append('images', file);
        });

        try {
            await onSubmit(data); // Pass FormData to parent
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-form-overlay">
            <div className="product-form-modal">
                <header>
                    <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
                    <button onClick={onClose}><X size={24} /></button>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-column">
                            <div className="form-group">
                                <label>Title</label>
                                <input name="title" value={formData.title} onChange={handleChange} required />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Discount Price</label>
                                    <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Brand</label>
                                    <input name="brand" value={formData.brand} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select name="category" value={formData.category} onChange={handleChange}>
                                        <option>Tops</option>
                                        <option>Bottoms</option>
                                        <option>Outerwear</option>
                                        <option>Accessories</option>
                                        <option>Sneakers</option>
                                        <option>Sets</option>
                                        <option>Utility</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} />
                            </div>

                            <div className="form-group">
                                <label>Tags (comma separated)</label>
                                <input name="tags" value={formData.tags} onChange={handleChange} placeholder="summer, casual, cotton" />
                            </div>
                        </div>

                        <div className="form-column">
                            <h3>Images</h3>
                            <div className="image-upload-area">
                                <input type="file" id="img-upload" multiple accept="image/*" onChange={handleImageChange} hidden />
                                <label htmlFor="img-upload" className="upload-label">
                                    <Upload size={24} />
                                    <span>Click to Upload</span>
                                </label>
                            </div>
                            <div className="image-previews">
                                {images.map((img, i) => (
                                    <div key={i} className="img-preview">
                                        <img src={img.url} alt="existing" />
                                        {/* Optional: Add delete button for existing images */}
                                    </div>
                                ))}
                                {newImages.map((file, i) => (
                                    <div key={`new-${i}`} className="img-preview new">
                                        <img src={URL.createObjectURL(file)} alt="preview" />
                                        <button type="button" onClick={() => handleRemoveNewImage(i)}><X size={14} /></button>
                                    </div>
                                ))}
                            </div>

                            <h3>Toggles</h3>
                            <div className="toggles">
                                <label className="toggle-row">
                                    <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
                                    Featured
                                </label>
                                <label className="toggle-row">
                                    <input type="checkbox" name="newArrival" checked={formData.newArrival} onChange={handleChange} />
                                    New Arrival
                                </label>
                                <label className="toggle-row">
                                    <input type="checkbox" name="sale" checked={formData.sale} onChange={handleChange} />
                                    On Sale
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="variants-section">
                        <div className="section-header">
                            <h3>Variants (Size/Color/Stock)</h3>
                            <button type="button" className="btn-small" onClick={handleAddVariant}><Plus size={16} /> Add</button>
                        </div>
                        {variants.map((v, i) => (
                            <div key={i} className="variant-row">
                                <input placeholder="Size" value={v.size} onChange={(e) => handleVariantChange(i, 'size', e.target.value)} />
                                <input placeholder="Color" value={v.color} onChange={(e) => handleVariantChange(i, 'color', e.target.value)} />
                                <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => handleVariantChange(i, 'stock', e.target.value)} />
                                <input placeholder="SKU" value={v.sku} onChange={(e) => handleVariantChange(i, 'sku', e.target.value)} />
                                <button type="button" className="icon-btn delete" onClick={() => handleRemoveVariant(i)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="form-actions">
                        <Button variant="outline" onClick={onClose} type="button">Cancel</Button>
                        <Button variant="primary" type="submit" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Product'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;
