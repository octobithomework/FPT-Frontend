import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        localStorage.removeItem('token'); 
        navigate('/login'); 
    };

    if (location.pathname === '/login') {
        return <nav className="navbar"></nav>;
    }

    return (
        <nav className="navbar">
            <a href="/routine-management">Routines</a>
            <a href="/logout" onClick={handleLogout}>Logout</a>
        </nav>
    );
};

export default Navbar;
