import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { post } from '../../Utils/APIHelpers';

const SignupPage: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    const validateForm = () => {
        let isValid = true;
        setFirstNameError('');
        setLastNameError('');
        setEmailError('');
        setPasswordError('');

        if (!firstName) {
            setFirstNameError('First name is required.');
            isValid = false;
        }

        if (!lastName) {
            setLastNameError('Last name is required.');
            isValid = false;
        }

        if (!email) {
            setEmailError('Email is required.');
            isValid = false;
        } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Email is invalid.');
            isValid = false;
        }

        if (!password) {
            setPasswordError('Password is required.');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters.');
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            setPasswordError('Password must contain at least one uppercase letter.');
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            setPasswordError('Password must contain at least one lowercase letter.');
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            setPasswordError('Password must contain at least one number.');
            isValid = false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            setPasswordError('Password must contain at least one special character.');
            isValid = false;
        }

        return isValid;
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');

        if (!validateForm()) {
            return;
        }

        try {
            const response = await post('/register', {firstName, lastName, email, password})

            if (!response.ok) {
                throw new Error('Signup failed. Make sure you are using a unique email address.');
            }

            // Assuming the API response includes a token upon successful signup
            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/dashboard'); // Redirect to dashboard or a welcome page
        } catch (err) {
            if (err instanceof Error) {
                setFormError(err.message);
            } else {
                setFormError('An unexpected error occurred.');
            }
        }
    };

    return (
        <div className="signup-container">
        <form onSubmit={handleSignup} className="signup-form">
            {formError && <p className="form-error">{formError}</p>}
            <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                {firstNameError && <span className="error">{firstNameError}</span>}
            </div>
            <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                {lastNameError && <span className="error">{lastNameError}</span>}
            </div>
            <div className="form-field">
                <label htmlFor="email">Email</label>
                <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {emailError && <span className="error">{emailError}</span>}
            </div>
            <div className="form-field">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {passwordError && <span className="error">{passwordError}</span>}
            </div>
            <button type="submit" className="submit-btn">Sign Up</button>
            <div className="signup-actions">
                <Link to="/login" className="action-link">Have an account? Login</Link>
            </div>
        </form>
    </div>
);
};
export default SignupPage;
