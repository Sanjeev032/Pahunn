import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from '../Button'; // Assuming generic button exists or use standard button

const ErrorRetry = ({ message = "Something went wrong", onRetry }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            gap: '1rem',
            textAlign: 'center',
            color: '#ef4444'
        }}>
            <AlertCircle size={48} />
            <h3>{message}</h3>
            {onRetry && (
                <Button onClick={onRetry} variant="outline" className="retry-btn">
                    <RefreshCw size={16} style={{ marginRight: '0.5rem' }} /> Try Again
                </Button>
            )}
        </div>
    );
};

export default ErrorRetry;
