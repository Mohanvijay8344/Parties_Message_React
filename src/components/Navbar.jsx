import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-text">Mohanraj</Link>
      </div>
      
      <div className="navbar-menu-icon" onClick={toggleMenu}>
        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
        <li><Link to="/piece-calculator" onClick={toggleMenu}>Piece Calculator</Link></li>
        <li><Link to="/charts" onClick={toggleMenu}>Charts</Link></li>
        <li><Link to="/contacts" onClick={toggleMenu}>Contacts</Link></li>
        <li><Link to="/calculator" onClick={toggleMenu}>Calculator</Link></li>
        <li><Link to="/pipe-counter" onClick={toggleMenu}>Pipe Counter</Link></li>
       
      </ul>
    </nav>
  );
};

export default Navbar;
