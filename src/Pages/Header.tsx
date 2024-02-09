// Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Import CSS file for styling

const Header: React.FC = () => {
  return (
    <header className="banner"> {/* Add banner class to header */}
      <nav>
        <ul>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

