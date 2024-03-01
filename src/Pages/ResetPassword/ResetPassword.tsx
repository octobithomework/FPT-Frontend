import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './ResetPassword.css';
import { post } from '../../Utils/APIHelpers';
import { Button, FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';

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
            const response = await post('/reset-password/' + token, { newPassword })

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
                <FormControl isInvalid={!!formError} className="form-error">
                    {formError && <FormErrorMessage>{formError}</FormErrorMessage>}
                </FormControl>

                <FormControl>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <Input type="email" id="email" value={email} isDisabled />
                </FormControl>
                <FormControl isInvalid={!!passwordError}>
                    <FormLabel htmlFor='new-password'>New Password</FormLabel>
                    <Input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    {passwordError && <FormErrorMessage>{passwordError}</FormErrorMessage>}
                </FormControl>
                <FormControl isInvalid={!!confirmPasswordError}>
                    <FormLabel htmlFor='confirm-password'>Confirm Password</FormLabel>
                    <Input
                        type="password"
                        id="confirm-password"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />
                    {confirmPasswordError && <FormErrorMessage>{confirmPasswordError}</FormErrorMessage>}
                </FormControl>

                <Button type="submit" className="submit-btn">Reset Password</Button>
            </form>
        </div>
    );
};

export default ResetPasswordPage;
