// components/Preloader.tsx (Updated - Add image with glow, center text, one line)
import React from 'react';

const Preloader: React.FC = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--background)',
        display: 'flex',
        flexDirection: 'column', // Stack image above text
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        color: 'var(--text)',
        fontSize: '2rem',
        transition: 'opacity 0.5s ease', // Basic CSS transition; GSAP overrides in utils
      }}
    >
      <img src="/abyss-logo.png" alt="Abyss Logo" className="preloader-image glow" style={{ marginBottom: '0.5rem' }} /> {/* UPDATED: Reduced margin for "slightly above" */}
      <div className="glow" style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>ENTERING THE ABYSS...</div> {/* Center and nowrap */}
    </div>
  );
};

export default Preloader;