// App.tsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';
import LoginPage from './Pages/Login/Login';
// import HomePage from './HomePage';
// import ProtectedPage from './ProtectedPage';

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/login" element={<LoginPage />} />
                {/* <Route path="/" element={<HomePage />} />
                <Route path="/protected" element={<ProtectedRoute component={ProtectedPage} />} /> */}
            </Routes>
        </Router>
    );
};

export default App;
