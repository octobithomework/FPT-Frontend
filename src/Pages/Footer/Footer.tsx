// Footer.tsx

import React from 'react';
import './Footer.css'; 

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-text">
                © {new Date().getFullYear()} Fitness Progress Tracker
            </div>
        </footer>
    );
};

export default Footer;
