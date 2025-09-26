'use client';

import React, { useState } from 'react';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu toggle

  return (
    <header className="header-layout">
      <a href="/" style={{ padding: 0, margin: 0 }}>
        <img src="/abyss-logo.png" alt="Abyss Global Logo" height="100" /> {/* Increased to 100 for a little bigger */}
      </a>
      <nav className={`navbar-nav ${isOpen ? 'open' : ''}`}>
        <a href="#about" className="nav-link" onClick={() => setIsOpen(false)}>About</a>
        <a href="#project-1" className="nav-link" onClick={() => setIsOpen(false)}>Projects</a>
        <a href="#contact" className="nav-link" onClick={() => setIsOpen(false)}>Contact</a>
        <a href="/blog" className="nav-link" onClick={() => setIsOpen(false)}>Blog</a>
      </nav>
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>☰</div> {/* Hamburger icon */}
    </header>
  );
};

export default Header;