import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


interface ProtectedRouteProps {
    component: React.ElementType;
}

const isAuth = (): boolean => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const decoded: { exp: number } = jwtDecode(token);
            return decoded.exp > Date.now() / 1000;
        } catch (error) {
            console.error("Token decoding error:", error);
            return false;
        }
    }
    return false;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => (
    isAuth() ? <Component /> : <Navigate to="/login" />
);

export default ProtectedRoute;
