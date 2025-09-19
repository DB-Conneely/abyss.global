import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';

import * as animations from '@/utils/animations';

const CTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const handleClick = useCallback(() => {
    animations.ctaBurst; // Call from utils (assumes camera ref passed globally or via context; placeholder)
    console.log('CTA clicked: Burst triggered');
  }, []);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, scale: 0.9 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          onEnter: () => document.body.dispatchEvent(new CustomEvent('sectionBurst', { detail: { index: 4 } })),
        },
      }
    );

    if (buttonRef.current) {
      buttonRef.current.addEventListener('click', handleClick);
      return () => buttonRef.current?.removeEventListener('click', handleClick);
    }
  }, [handleClick]);

  return (
    <section ref={sectionRef} className="section" id="cta">
      <h2 className="glow">Ready to Embark?</h2>
      <button ref={buttonRef} className="glow" style={{ padding: '1rem 2rem', backgroundColor: 'var(--primary-purple)', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>
        Get Started
      </button>
    </section>
  );
};

export default CTA;