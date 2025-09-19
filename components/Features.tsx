import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Features: React.FC = () => {
  const featureRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    featureRefs.current.forEach((el, index) => {
      if (el) {
        gsap.fromTo(
          el,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              onEnter: () => {
                document.body.dispatchEvent(new CustomEvent('sectionBurst', { detail: { index: index + 1 } }));
              },
            },
          }
        );
      }
    });
  }, []);

  return (
    <>
      <section ref={(el) => { featureRefs.current[0] = el; }} className="section" id="feature1">
        <h2 className="glow">Feature 1: Nebula Views</h2>
        <p>Discover swirling cosmic clouds in stunning detail.</p>
      </section>
      <section ref={(el) => { featureRefs.current[1] = el; }} className="section" id="feature2">
        <h2 className="glow">Feature 2: Star Navigation</h2>
        <p>Navigate through infinite starfields with ease.</p>
      </section>
      <section ref={(el) => { featureRefs.current[2] = el; }} className="section" id="feature3">
        <h2 className="glow">Feature 3: Cosmic Insights</h2>
        <p>Gain profound knowledge from the depths of space.</p>
      </section>
    </>
  );
};

export default Features;