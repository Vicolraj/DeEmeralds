import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/img/logo_nobg.webp'; 
import './Header.css'; 
import { motion } from 'framer-motion';

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
    <motion.header className="header"
    initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0,  }}
            viewport={{ once: false }}
            transition={{ duration: 0.5 }}>
      <div className="header-container">
        <a href="#hero" className="logo">
            <img src={logo} alt="De Emeralds Logo" />
            <span>De Emeralds</span>
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
    </motion.header>
  );
};

export default Header;