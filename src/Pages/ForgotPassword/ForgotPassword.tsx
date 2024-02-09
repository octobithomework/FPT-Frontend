import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [formError, setFormError] = useState('');

    const validateEmail = () => {
        setEmailError('');

        if (!email) {
            setEmailError('Email is required.');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail()) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/forgot-password/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                throw new Error('Failed to send password reset email.');
            }

            setFormSuccess('A password reset email has been sent if the email is registered in our system.');
            setEmail('');
        } catch (err) {
            if (err instanceof Error) {
                setFormError(err.message);
            } else {
                setFormError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="forgot-password-container"> 
            <form onSubmit={handleSubmit} className="forgot-password-form"> 
                {formSuccess && <p className="form-success">{formSuccess}</p>}
                {formError && <p className="form-error">{formError}</p>}
                <div className="form-field">
                    <label>Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {emailError && <span className="error">{emailError}</span>}
                </div>
                <button type="submit" className="submit-btn">Send Reset Email</button>
                <div className="forgot-password-actions">
                    <Link to="/login" className="action-link">Return to Login</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
