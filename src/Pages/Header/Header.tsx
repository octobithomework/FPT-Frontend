import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import logo from '../../Assets/placeholder-logo.png';
import './Header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <div className="logo-container">
                <img src={logo} className="logo" alt="logo" />
                <div className="header-text">
                    <Link to="/dashboard">Fitness Progress Tracker</Link>
                </div>
            </div>
            
            <Navbar />
        </header>
    );
};

export default Header;