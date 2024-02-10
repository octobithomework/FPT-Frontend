// ResetPasswordPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import './ResetPassword.css';

interface TokenPayload {
    sub: string;
}

const ResetPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();
    const { token } = useParams<{ token: string }>();

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<TokenPayload>(token);
                setEmail(decoded.sub);
            } catch (error) {
                navigate('/login');
            }
        }
    }, [token, navigate]);

    const validatePasswords = () => {
        let isValid = true;
        setPasswordError('');
        setConfirmPasswordError('');

        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            isValid = false;
        } else if (!/[A-Z]/.test(newPassword)) {
            setPasswordError('Password must contain at least one uppercase letter.');
            isValid = false;
        } else if (!/[a-z]/.test(newPassword)) {
            setPasswordError('Password must contain at least one lowercase letter.');
            isValid = false;
        } else if (!/[0-9]/.test(newPassword)) {
            setPasswordError('Password must contain at least one number.');
            isValid = false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
            setPasswordError('Password must contain at least one special character.');
            isValid = false;
        }

        if (newPassword !== confirmNewPassword && newPassword.length > 0) {
            setConfirmPasswordError('Passwords do not match.');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!validatePasswords()) {
            return;
        }

        try {
            // Example API call
            const response = await fetch('http://localhost:5000/api/reset-password/' + token, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newPassword })
            });

            if (!response.ok) {
                throw new Error('Failed to reset password.');
            }

            navigate('/login');
        } catch (error) {
            setFormError('An error occurred while resetting the password.');
        }
    };

    return (
        <div className="reset-password-container">
            <form onSubmit={handleSubmit} className="reset-password-form">
                {formError && <p className="form-error">{formError}</p>}
                <div className="form-field">
                    <label>Email</label>
                    <input type="email" value={email} disabled />
                </div>
                <div className="form-field">
                    <label>New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    {passwordError && <span className="error">{passwordError}</span>}
                </div>
                <div className="form-field">
                    <label>Confirm Password</label>
                    <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    {confirmPasswordError && <span className="error">{confirmPasswordError}</span>}
                </div>
                <button type="submit" className="submit-btn">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
