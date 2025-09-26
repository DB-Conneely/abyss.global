// components/Header.tsx (Updated - Fix navigation from blog with absolute links and router push)
'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; // Add imports for pathname/router

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Detect current path
  const router = useRouter(); // For programmatic navigation
  const isBlog = pathname.startsWith('/blog'); // Check if on blog pages

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false); // Close mobile menu
    const fullHref = isBlog ? `/${href}` : href; // Prefix '/' if on blog to redirect to main
    router.push(fullHref); // Navigate
    // After push, scroll to hash (use event for Lenis or native)
    if (fullHref.includes('#')) {
      const hash = fullHref.split('#')[1];
      setTimeout(() => {
        document.body.dispatchEvent(new CustomEvent('scrollToHash', { detail: { hash } })); // Trigger custom scroll
      }, 100); // Delay for page load
    }
  };

  return (
    <header className="header-layout">
      <a href="/" style={{ padding: 0, margin: 0 }}>
        <img src="/abyss-logo.png" alt="Abyss Global Logo" height="100" />
      </a>
      <nav className={`navbar-nav ${isOpen ? 'open' : ''}`}>
        <a href="#about" className="nav-link" onClick={(e) => handleNavClick(e, '#about')}>About</a>
        <a href="#project-1" className="nav-link" onClick={(e) => handleNavClick(e, '#project-1')}>Projects</a>
        <a href="#contact" className="nav-link" onClick={(e) => handleNavClick(e, '#contact')}>Contact</a>
        <a href="/blog" className="nav-link" onClick={(e) => handleNavClick(e, '/blog')}>Blog</a> {/* No hash; direct */}
      </nav>
      <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>☰</div>
    </header>
  );
};

export default Header;