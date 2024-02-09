// App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';
import LoginPage from './Pages/Login/Login';
import ProtectedRoute from './Utils/ProtectedRoute';
import Header from './Pages/Header/Header';
import Footer from './Pages/Footer/Footer';
import SignupPage from './Pages/Signup/Signup';
import ForgotPasswordPage from './Pages/ForgotPassword/ForgotPassword';
import ResetPasswordPage from './Pages/ResetPassword/ResetPassword';
import DashboardPage from './Pages/Dashboard/Dashboart';
// import HomePage from './HomePage';
// import ProtectedPage from './ProtectedPage';

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/dashboard" element={<ProtectedRoute component={DashboardPage} />} />
                <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
