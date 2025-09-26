// components/BlogPreloader.tsx (New File - Similar to Preloader, themed for blog)
import React from 'react';

const BlogPreloader: React.FC = () => {
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
        transition: 'opacity 0.5s ease', // Smooth fade out
      }}
    >
      <div className="glow">ENTERING THE VOID...</div> {/* Themed text with glow */}
    </div>
  );
};

export default BlogPreloader;