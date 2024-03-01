// LoginPage.tsx

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { post } from '../../Utils/APIHelpers';
import { isAuth } from '../../Utils/IsAuth';
import './Login.css';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth()) {
            navigate('/dashboard');
        }
    }, [navigate]);

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
            const response = await post("/login", { email, password })

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
            <form onSubmit={handleLogin} className="login-form input-form">
                <FormControl isInvalid={!!formError} className="form-error">
                    {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
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

                <Button type="submit" className="submit-btn">Login</Button>
                <div className="login-actions">
                    <Link to="/signup" className="action-link">Signup</Link>
                    <Link to="/forgot-password" className="action-link">Forgot Password</Link>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
