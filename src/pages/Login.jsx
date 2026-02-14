import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        } else {
            setError(result.error);
        }
    };

    return (
        <AuthLayout title="WELCOME BACK" subtitle="Login to access your exclusive drops">
            <form className="auth-form" onSubmit={handleSubmit}>
                {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
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
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <Button variant="primary" fullWidth size="lg" disabled={loading}>
                    {loading ? 'LOGGING IN...' : 'LOGIN'}
                </Button>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/signup" className="auth-link">Sign Up</Link>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
