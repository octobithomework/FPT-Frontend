// Footer.tsx

import React from 'react';
import './Footer.css'; 

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            © {new Date().getFullYear()} Fitness Progress Tracker
        </footer>
    );
};

export default Footer;
