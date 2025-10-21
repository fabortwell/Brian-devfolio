import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaLeaf, FaChevronDown } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.classList.toggle('menu-open', !isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('menu-open');
  };

  const toggleThemeDropdown = () => {
    setIsThemeDropdownOpen(!isThemeDropdownOpen);
  };

  const handleThemeChange = (newTheme) => {
    toggleTheme(newTheme);
    setIsThemeDropdownOpen(false);
    if (isMenuOpen) {
      closeMenu();
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'dark':
        return <FaMoon className="theme-icon" />;
      case 'green':
        return <FaLeaf className="theme-icon" />;
      default:
        return <FaSun className="theme-icon" />;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case 'dark':
        return 'Dark';
      case 'green':
        return 'Green';
      default:
        return 'Light';
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <div className="logo">
            <h2>Brian.</h2>
          </div>
          
          <ul className="nav-links">
            <li><a href="#home" onClick={closeMenu}>Home</a></li>
            <li><a href="#about" onClick={closeMenu}>About</a></li>
            <li><a href="#service" onClick={closeMenu}>Service</a></li>
            <li><a href="#portfolio" onClick={closeMenu}>Portfolio</a></li>
            <li><a href="#testimonial" onClick={closeMenu}>Testimonial</a></li>
            <li><a href="#blog" onClick={closeMenu}>Blog</a></li>
          </ul>

          <div className="nav-right">
            <div className="theme-switcher">
              <button 
                className="theme-dropdown-btn"
                onClick={toggleThemeDropdown}
                aria-label="Change theme"
              >
                {getThemeIcon()}
                <span>{getThemeLabel()}</span>
                <FaChevronDown size={12} />
              </button>
              
              {isThemeDropdownOpen && (
                <div className="theme-dropdown">
                  <button 
                    className={`theme-option ${theme === 'light' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('light')}
                  >
                    <FaSun className="theme-icon" />
                    Light
                  </button>
                  <button 
                    className={`theme-option ${theme === 'dark' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('dark')}
                  >
                    <FaMoon className="theme-icon" />
                    Dark
                  </button>
                  <button 
                    className={`theme-option ${theme === 'green' ? 'active' : ''}`}
                    onClick={() => handleThemeChange('green')}
                  >
                    <FaLeaf className="theme-icon" />
                    Green
                  </button>
                </div>
              )}
            </div>
            
            <div className="contact-btn-container">
              <a href="#contact" className="contact-btn" onClick={closeMenu}>Contact Me</a>
            </div>
          </div>
          
          <div className="mobile-controls">
            <button 
              className="mobile-theme-toggle"
              onClick={toggleThemeDropdown}
              aria-label="Change theme"
            >
              {getThemeIcon()}
            </button>
            
            {isThemeDropdownOpen && (
              <div className="mobile-theme-dropdown">
                <button 
                  className={`mobile-theme-option ${theme === 'light' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('light')}
                >
                  <FaSun className="theme-icon" />
                  Light
                </button>
                <button 
                  className={`mobile-theme-option ${theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('dark')}
                >
                  <FaMoon className="theme-icon" />
                  Dark
                </button>
                <button 
                  className={`mobile-theme-option ${theme === 'green' ? 'active' : ''}`}
                  onClick={() => handleThemeChange('green')}
                >
                  <FaLeaf className="theme-icon" />
                  Green
                </button>
              </div>
            )}
            
            <button 
              className={`mobile-menu-btn ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
      
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-logo">
            <h3>Brian.</h3>
          </div>
        </div>
        
        <ul className="mobile-nav-links">
          <li><a href="#home" onClick={closeMenu}>Home</a></li>
          <li><a href="#about" onClick={closeMenu}>About</a></li>
          <li><a href="#service" onClick={closeMenu}>Service</a></li>
          <li><a href="#portfolio" onClick={closeMenu}>Portfolio</a></li>
          <li><a href="#testimonial" onClick={closeMenu}>Testimonial</a></li>
          <li><a href="#blog" onClick={closeMenu}>Blog</a></li>
        </ul>
        
        <div className="mobile-contact-btn-container">
          <a href="#contact" className="contact-btn mobile-contact-btn" onClick={closeMenu}>Contact Me</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;