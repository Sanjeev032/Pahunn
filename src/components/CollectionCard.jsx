import React from 'react';
import './CollectionCard.css';
import { ArrowRight } from 'lucide-react';

const CollectionCard = ({ title, image, size = 'default' }) => {
    return (
        <div className={`collection-card collection-card--${size}`}>
            <div className="collection-card__image" style={{ backgroundImage: `url(${image})` }}></div>
            <div className="collection-card__overlay">
                <div className="collection-card__content">
                    <h3 className="collection-card__title">{title}</h3>
                    <button className="collection-card__btn">
                        Explore <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollectionCard;
