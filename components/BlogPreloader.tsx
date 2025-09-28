// components/BlogPreloader.tsx (Updated - Add style to center and allow wrap if needed)
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
      <div className="glow" style={{ textAlign: 'center' }}>ENTERING THE VOID...</div> {/* Add style to center; implicit wrap */}
    </div>
  );
};
export default BlogPreloader;