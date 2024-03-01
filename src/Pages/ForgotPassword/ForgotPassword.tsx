import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ForgotPassword.css';
import { post } from '../../Utils/APIHelpers';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

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
        setFormSuccess('');
        setFormError('');

        if (!validateEmail()) {
            return;
        }

        try {
            const response = await post("/forgot-password/", { email })

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
                <FormControl isInvalid={!!formSuccess} className="form-success">
                    {formSuccess && <FormErrorMessage>{formSuccess}</FormErrorMessage>}
                </FormControl>
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

                <Button type="submit" className="submit-btn">Send Reset Email</Button>
                <div className="forgot-password-actions">
                    <Link to="/login" className="action-link">Return to Login</Link>
                </div>
            </form>
        </div>
    );
};

export default ForgotPasswordPage;
