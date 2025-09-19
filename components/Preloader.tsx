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
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        color: 'var(--text)',
        fontSize: '2rem',
        transition: 'opacity 0.5s ease', // Basic CSS transition; GSAP overrides in utils
      }}
    >
      <div className="glow">Loading Universe...</div> {/* Simple text with glow class from globals.css */}
    </div>
  );
};

export default Preloader;