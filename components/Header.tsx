// components/Header.tsx (Updated - Fix fullHref concatenation for absolute paths; add reload if already on target page)
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

    let fullHref = href;
    if (href.startsWith('#')) {
      // For hash links: Prefix with / if on blog to go to home#section
      fullHref = isBlog ? `/#${href.slice(1)}` : href;
    } else if (href.startsWith('/')) {
      // For absolute paths like /blog: No extra prefix
      fullHref = href;
    }

    // NEW: If already on the target page (ignore hash), force reload
    const targetPath = fullHref.split('#')[0]; // e.g., / for home sections, /blog for blog
    if (targetPath === pathname) {
      window.location.reload(); // Refresh current page
      return;
    }

    // If on blog and navigating to a homepage section (hash), force full reload
    if (isBlog && href.startsWith('#')) {
      window.location.href = fullHref; // e.g., '/#about' - browser reloads fully and handles hash scroll
    } else {
      router.push(fullHref); // Otherwise, client-side navigation
    }

    // Existing: Handle delayed scroll for hash (browser auto-handles on full reload, but keep for client-side)
    if (fullHref.includes('#')) {
      const hash = fullHref.split('#')[1];
      setTimeout(() => {
        document.body.dispatchEvent(new CustomEvent('scrollToHash', { detail: { hash } }));
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