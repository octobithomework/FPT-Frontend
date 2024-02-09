import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Assume you create a corresponding CSS file

const Header: React.FC = () => {
    return (
        <header className="header">
            <h3 className="header-text"><Link to="dashboard">Fitness Progress Tracker</Link></h3>
            <nav className="navbar">
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
        </header>
    );
};

export default Header;
