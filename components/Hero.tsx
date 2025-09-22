// components/Hero.tsx
import React from 'react';

const Hero: React.FC = () => {
  // The animation is now handled by the heroOpen function in utils/animations.ts
  // This component is now purely presentational.
  return (
    <section className="section" id="hero">
      <h1 className="glow">Abyss Global</h1>
      <p>Navigate the Digital Void</p>
    </section>
  );
};

export default Hero;