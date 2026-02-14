import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import { CheckCircle } from 'lucide-react';

const OrderSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="container" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
            <CheckCircle size={64} color="#2ecc71" style={{ marginBottom: '1rem' }} />
            <h1>Order Placed Successfully!</h1>
            <p style={{ margin: '1rem 0 2rem', fontSize: '1.1rem', color: '#666' }}>
                Thank you for your purchase. Your order has been confirmed.
                {orderId && <br />}
                {orderId && <span>Order ID: <strong>{orderId}</strong></span>}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <Link to="/my-orders">
                    <Button variant="outline">VIEW ORDER</Button>
                </Link>
                <Link to="/collections">
                    <Button variant="primary">CONTINUE SHOPPING</Button>
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccess;
