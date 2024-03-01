import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';
import { post } from '../../Utils/APIHelpers';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

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
            const response = await post('/register', { firstName, lastName, email, password })

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
                <FormControl isInvalid={!!formError} className="form-error">
                    {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={!!firstNameError}>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    {firstNameError && <FormErrorMessage>{firstNameError}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={!!lastNameError}>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    {lastNameError && <FormErrorMessage>{lastNameError}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={!!emailError}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={!!passwordError}>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                </FormControl>

                <Button type="submit" className="submit-btn">Signup</Button>
                <div className="signup-actions">
                    <Link to="/login" className="action-link">Have an account? Login</Link>
                </div>
            </form>
        </div>
    );
};
export default SignupPage;
