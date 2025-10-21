
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaSun, FaMoon, FaLeaf, FaPalette } from 'react-icons/fa';
import './FloatingThemeToggle.css';

const FloatingThemeToggle = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const themes = [
    { id: 'light', icon: <FaSun />, label: 'Light' },
    { id: 'dark', icon: <FaMoon />, label: 'Dark' },
    { id: 'green', icon: <FaLeaf />, label: 'Green' }
  ];

  return (
    <div className={`floating-theme-toggle ${isOpen ? 'open' : ''}`}>
      <div className="theme-options">
        {themes.map((themeOption) => (
          <button
            key={themeOption.id}
            className={`theme-option ${theme === themeOption.id ? 'active' : ''}`}
            onClick={() => {
              toggleTheme(themeOption.id);
              setIsOpen(false);
            }}
            aria-label={`Switch to ${themeOption.label} theme`}
          >
            {themeOption.icon}
          </button>
        ))}
      </div>
      <button
        className="toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme options"
      >
        <FaPalette />
      </button>
    </div>
  );
};

export default FloatingThemeToggle;