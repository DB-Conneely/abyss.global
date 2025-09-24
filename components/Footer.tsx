// components/Footer.tsx
import React from 'react';

const Footer: React.FC = () => {
  return (
    // Revert Footer to its original, non-.section structure
    <footer
      style={{
        // Keep original styles, ensuring it behaves like a normal block element
        position: 'relative', // Relative to flow in content
        zIndex: 1,
        padding: '2rem',
        textAlign: 'center',
        backgroundColor: 'var(--background)',
        color: 'var(--text)',
        fontSize: '0.875rem',
        width: '100%', // Ensure it spans the width
        // Do not set explicit height or min-height
      }}
    >
      <p>© 2025 Abyss Global. All rights reserved.</p>
      {/* Placeholder for links or additional info if needed */}
    </footer>
  );
};

export default Footer;