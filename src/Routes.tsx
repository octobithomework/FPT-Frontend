import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Pages/Header';
import SignupPage from './Pages/Signup/SignupPage'; // getting signup and login page
import Login from './Pages/Login/Login';

// defining routes
const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default Routes;

