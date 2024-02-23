import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuth } from './IsAuth';

interface ProtectedRouteProps {
    component: React.ElementType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => (
    isAuth() ? <Component /> : <Navigate to="/login" />
);

export default ProtectedRoute;
