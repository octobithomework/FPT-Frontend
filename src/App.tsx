// App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './Pages/Login/Login';
import ProtectedRoute from './Utils/ProtectedRoute';
import Header from './Pages/Header/Header';
import Footer from './Pages/Footer/Footer';
import SignupPage from './Pages/Signup/Signup';
import ForgotPasswordPage from './Pages/ForgotPassword/ForgotPassword';
import ResetPasswordPage from './Pages/ResetPassword/ResetPassword';
import DashboardPage from './Pages/Dashboard/Dashboart';
import ExerciseDetailPage from './Pages/Exercises/ExerciseDetail';
import RoutineDetailPage from './Pages/Routines/RoutineDetail/RoutineDetail';
import RoutineManagementPage from './Pages/Routines/RoutineManagement/RoutineManagement';
import UserProfilePage from './Pages/UserProfile/UserProfile';

const App: React.FC = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                <Route path="/dashboard" element={<ProtectedRoute component={DashboardPage} />} />
                <Route path="/exercise-details/:exerciseId" element={<ExerciseDetailPage />} />
                <Route path="/routine-details/:routineId" element={<ProtectedRoute component={RoutineDetailPage} />} />
                <Route path="/routine-management" element={<ProtectedRoute component={RoutineManagementPage} />} />
                <Route path="/user-profile" element={<ProtectedRoute component={UserProfilePage} />} />
                <Route path="*" element={<Navigate replace to="/login" />} />
            </Routes>
            <Footer />
        </Router>
    );

};

export default App;
