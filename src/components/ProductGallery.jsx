import React, { useState } from 'react';
import './ProductGallery.css';

const ProductGallery = ({ images }) => {
    const [activeImage, setActiveImage] = useState(images[0]);

    return (
        <div className="product-gallery">
            <div className="gallery-main">
                <img src={activeImage} alt="Product View" />
            </div>
            <div className="gallery-thumbs">
                {images.map((img, idx) => (
                    <button
                        key={idx}
                        className={`gallery-thumb ${activeImage === img ? 'active' : ''}`}
                        onClick={() => setActiveImage(img)}
                    >
                        <img src={img} alt={`Thumbnail ${idx + 1}`} />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;
