import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        position: 'relative',
        zIndex: 1,
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'var(--background)',
        color: 'var(--text)',
        fontSize: '0.875rem',
      }}
    >
      <p>© 2025 xAI. All rights reserved.</p>
      {/* Placeholder for links or additional info if needed */}
    </footer>
  );
};

export default Footer;