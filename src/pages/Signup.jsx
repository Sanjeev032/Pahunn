import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await register({ name, email, password });
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <AuthLayout title="JOIN THE CREW" subtitle="Create an account to get started">
            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
                <div className="form-group">
                    <label>Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email Address</label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <Button variant="primary" fullWidth size="lg" disabled={loading}>
                    {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
                </Button>

                <div className="auth-footer">
                    Already have an account?
                    <Link to="/login" className="auth-link">Login</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Signup;
