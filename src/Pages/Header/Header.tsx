import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import { post } from '../../Utils/APIHelpers';

const handleLogout = async (e: React.FormEvent) => {

    try {
        localStorage.removeItem('token');
    }
    catch (err) {
        throw err
    }
}

function LoginLogoutButton() {
    if (localStorage.getItem('token')) {
        return (<div className = "login-logout">
        <form onSubmit={handleLogout}>
            <button className="login-logout-btn">
                Log Out
            </button>
        </form>
        </div>)
    }
    else {
        return (<div className = "login-logout">
        <Link to="Login" className="login-logout-btn">
            Log In
        </Link>
        <Link to="Signup" className="login-logout-btn">
            Sign Up
        </Link>
        </div>)
    }
}

const Header: React.FC = () => {
    return (
        <header className="header">
        
            <Link to="/dashboard">
                <img src={require("../../Assets/placeholder-logo.png")} className="logo" alt="Lifting Progress Tracker"></img>
                <span className="header-text">Fitness Progress Tracker</span>
            </Link>
        
            <nav className="navbar">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/about">About</Link>
                <Link to="/contact">Contact</Link>
            </nav>
            <LoginLogoutButton />
        </header>
    );
};

export default Header;
