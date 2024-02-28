import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { Link } from 'react-router-dom';

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
            <Link to="/routine-management">Routines</Link>
            <Link to="/logout" onClick={handleLogout}>Logout</Link>
        </nav>
    );
};

export default Navbar;
