import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/img/logo_nobg.png'; // Your logo
import './Header.css'; // We'll create this CSS file next

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { title: 'Home', href: '#hero' },
    { title: 'About Us', href: '#about' },
    { title: 'Our Choir', href: '#choir' },
    { title: 'Gallery', href: '#gallery' },
    { title: 'Rehearsals', href: '#rehearsal' },
    { title: 'Contact', href: '#contact' },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="header">
      <div className="header-container">
        <a href="#hero" className="logo">
          <img src={logo} alt="De Emerald Logo" />
          <span>De Emerald</span>
        </a>
        
        <nav className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            {navLinks.map((link) => (
              <li key={link.title}>
                <a href={link.href} onClick={() => setIsMenuOpen(false)}>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </div>
    </header>
  );
};

export default Header;