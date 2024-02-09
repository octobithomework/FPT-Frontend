// LoginPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; 

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Email is required.');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        } 

        return isValid;
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!validateForm()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Login failed.');
            }

            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/dashboard');
        } catch (err) {
            if (err instanceof Error) {
                setFormError(err.message);
            } else {
                setFormError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleLogin} className="login-form">
                {formError && <p className="form-error">{formError}</p>}
                <div className="form-field">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {emailError && <span className="error">{emailError}</span>}
                </div>
                <div className="form-field">
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {passwordError && <span className="error">{passwordError}</span>}
                </div>
                <button type="submit" className="submit-btn">Login</button>
                <div className="login-actions">
                    <Link to="/signup" className="action-link">Signup</Link>
                    <Link to="/forgot-password" className="action-link">Forgot Password</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
