'use client';

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header-layout">
      <a href="/" style={{ padding: 0, margin: 0 }}>
        <img src="/abyss-logo.png" alt="Abyss Global Logo" height="110" /> {/* Increased to 80 for more noticeable size */}
      </a>
      <nav className="navbar-nav">
        <a href="#about" className="nav-link">About</a>
        <a href="#project-1" className="nav-link">Projects</a>
        <a href="#contact" className="nav-link">Contact</a>
        <a href="#" onClick={() => alert('TO DO')} className="nav-link">Blog</a> {/* Alert for Blog */}
      </nav>
    </header>
  );
};

export default Header;