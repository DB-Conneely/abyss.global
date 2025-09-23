'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import Lenis from 'lenis';
import gsap from 'gsap';

import Preloader from '@/components/Preloader';
import Scene from '@/components/Scene';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Project from '@/components/Project';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const lenisRef = useRef<Lenis | null>(null);

  // Force load after 1.5s
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Lenis init
  useEffect(() => {
    if (!containerRef.current) return;

    const contentEl = containerRef.current.querySelector('#smooth-content') as HTMLElement;
    if (!contentEl) return;

    lenisRef.current = new Lenis({
      wrapper: containerRef.current,
      content: contentEl,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      touchMultiplier: 2,
      infinite: false,
    });

    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    const handleLenis = (e: any) => {
      setScrollY(lenisRef.current?.scroll || 0);
    };
    lenisRef.current?.on('scroll', handleLenis);

    // Resize for height changes
    const handleResize = () => {
      lenisRef.current?.resize();
      updateMainHeight();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      lenisRef.current?.off('scroll', handleLenis);
      lenisRef.current?.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Setup IntersectionObserver-based reveals after load
  useEffect(() => {
    if (isLoaded) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const sections = document.querySelectorAll('.section:not(#hero)');
      const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% of section is visible
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const section = entry.target as HTMLElement;
            section.classList.add('visible'); // Add class for CSS transition
            gsap.to(section, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }); // Optional GSAP for finer control
            document.body.dispatchEvent(new CustomEvent('sectionBurst', { detail: { index } }));
            observer.unobserve(section); // Once only
          }
        });
      }, observerOptions);

      sections.forEach((section) => observer.observe(section));

      return () => {
        sections.forEach((section) => observer.unobserve(section));
      };
    }
  }, [isLoaded]);

  // Function to dynamically set main minHeight to sum of children heights
  const updateMainHeight = () => {
    if (mainRef.current) {
      let totalHeight = 0;
      Array.from(mainRef.current.children).forEach((child) => {
        totalHeight += (child as HTMLElement).offsetHeight;
      });
      mainRef.current.style.minHeight = `${totalHeight}px`;
    }
  };

  // Calculate height after load and on content changes
  useEffect(() => {
    if (isLoaded) {
      updateMainHeight();
    }
  }, [isLoaded]);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div ref={containerRef} id="smooth-wrapper" style={{ height: '100%', overflow: 'hidden' }}>
      {!isLoaded && <Preloader />}
      <div id="canvas-container" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: !isMobile, alpha: true }}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%' }}
        >
          <Scene isMobile={isMobile} scrollY={scrollY} lenis={lenisRef.current} />
          <Preload all />
        </Canvas>
      </div>
      {/* Main content area - Removed explicit minHeight and paddingBottom; using dynamic calculation */}
      <main ref={mainRef} id="smooth-content" style={{ position: 'relative', zIndex: 1, overflowY: 'auto' }}>
        <Hero />
        <About />
        {/* Project instances with dummy data */}
        <Project
          index={1}
          title="Project Alpha"
          description="A groundbreaking exploration into the core of the digital nebula. Features advanced algorithms and immersive visuals."
          imageUrl=""
          projectLink="#"
        />
        <Project
          index={2}
          title="Project Beta"
          description="Navigating the treacherous asteroid fields of user experience. A testament to precision engineering and intuitive design."
          imageUrl=""
          projectLink="#"
        />
        <Project
          index={3}
          title="Current Mission: In Progress"
          description="A神秘 project currently under development. Stay tuned for launch details as we breach the event horizon."
          imageUrl=""
          projectLink="#"
        />
        <Contact />
        {/* Footer is placed last and should now sit correctly at the end */}
        <Footer />
      </main>
    </div>
  );
}