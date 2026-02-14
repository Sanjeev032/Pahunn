import React, { useState } from 'react';
import './RevolvingCards.css';

const categories = [
    { id: 1, title: 'MEN', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=600' },
    { id: 2, title: 'WOMEN', image: 'https://images.unsplash.com/photo-1617922001439-4a2e6562f328?auto=format&fit=crop&q=80&w=600' },
    { id: 3, title: 'KIDS', image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&q=80&w=600' },
    { id: 4, title: 'LUXURY', image: 'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&q=80&w=600' },
    { id: 5, title: 'SHOES', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600' },
];

const RevolvingCards = () => {
    const [rotation, setRotation] = useState(0);

    const rotate = (direction) => {
        setRotation(prev => prev + (direction === 'next' ? -72 : 72));
    };

    return (
        <section className="revolving-section">
            <h2 className="section-title">EXPLORE CATEGORIES</h2>
            <div className="carousel-container">
                <div
                    className="carousel-spinner"
                    style={{ transform: `rotateY(${rotation}deg)` }}
                >
                    {categories.map((cat, index) => (
                        <div
                            key={cat.id}
                            className="carousel-item glass-card"
                            style={{ transform: `rotateY(${index * 72}deg) translateZ(var(--radius))` }}
                        >
                            <div className="card-image" style={{ backgroundImage: `url(${cat.image})` }}></div>
                            <div className="card-content">
                                <h3>{cat.title}</h3>
                                <button className="btn-shop">SHOP NOW</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="carousel-controls">
                <button onClick={() => rotate('prev')}>&lt;</button>
                <button onClick={() => rotate('next')}>&gt;</button>
            </div>
        </section>
    );
};

export default RevolvingCards;
