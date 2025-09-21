// components/Hero.tsx
import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Listen for heroOpened event
    const handleOpen = () => {
      gsap.fromTo(
        [titleRef.current, subtitleRef.current],
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: 'power3.out' }
      );
    };
    document.body.addEventListener('heroOpened', handleOpen);

    return () => document.body.removeEventListener('heroOpened', handleOpen);
  }, []);

  return (
    <section ref={sectionRef} className="section" id="hero">
      <h1 ref={titleRef} className="glow">Abyss Global</h1>
      <p ref={subtitleRef}>Navigate the Digital Void</p>
    </section>
  );
};

export default Hero;