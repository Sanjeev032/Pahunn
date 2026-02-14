import React, { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import RevolvingCards from '../components/RevolvingCards';
import CollectionCard from '../components/CollectionCard';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const { newArrivals, fetchNewArrivals } = useProductStore();

  useEffect(() => {
    fetchNewArrivals();
  }, [fetchNewArrivals]);

  return (
    <div className="page-home">
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">PAHUNN</h1>
          <p className="hero-subtitle">PREMIUM STREETWEAR</p>
          <div className="hero-actions">
            <Link to="/new-arrivals" className="btn btn--primary btn--lg">
              Shop Latest
            </Link>
            <Link to="/collections" className="btn btn--outline btn--lg">
              View Collections
            </Link>
          </div>
        </div>
      </section>

      {/* 3D Revolving Categories */}
      <RevolvingCards />

      <section className="container featured-section">
        <h2 className="featured-title">FEATURED COLLECTIONS</h2>
        <div className="featured-grid">
          <CollectionCard
            title="STREET ESSENTIALS"
            image="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=800"
            size="large"
          />
          <CollectionCard
            title="NEON NIGHTS"
            image="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&q=80&w=800"
          />
          <CollectionCard
            title="URBAN WINTER"
            image="https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800"
          />
        </div>
      </section>

      {/* Brand Statement */}
      <section className="brand-section">
        <div className="container">
          <h2 className="brand-title">WE DON'T FOLLOW TRENDS</h2>
          <p className="brand-text">
            Pahunn is more than a brand. It's a movement. Born from the streets, designed for the future.
            We blend luxury aesthetics with raw urban energy to create pieces that speak before you do.
          </p>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="container arrivals-section">
        <div className="section-header">
          <h2 className="section-title">NEW ARRIVALS</h2>
          <Button variant="text" onClick={() => window.location.href = '/new-arrivals'}>VIEW ALL</Button>
        </div>

        <div className="product-grid-home">
          {newArrivals.length > 0 ? (
            newArrivals.map(product => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p>Loading new arrivals...</p>
          )}
        </div>
      </section>

      {/* Collections Sample Section (Different Style) */}
      <section className="container curated-section">
        <h2 className="curated-title">CURATED COLLECTIONS</h2>
        <div className="curated-grid">
          {/* Using ProductCards to show "sample" clothing in collections as requested */}
          <ProductCard
            product={{
              title: 'Monochrome Set',
              price: 12500.00,
              image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600',
              category: 'Sets',
              isNew: false
            }}
          />
          <ProductCard
            product={{
              title: 'Urban Utility Vest',
              price: 3500.00,
              image: 'https://images.unsplash.com/photo-1620799140408-ed5341cd2431?auto=format&fit=crop&q=80&w=600',
              category: 'Utility',
              isNew: false
            }}
          />
          <ProductCard
            product={{
              title: 'Reflective Jacket',
              price: 9999.00,
              image: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&q=80&w=600',
              category: 'Outerwear',
              isNew: false
            }}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;
