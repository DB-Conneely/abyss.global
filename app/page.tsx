'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import Lenis from 'lenis';
import gsap from 'gsap';

import Preloader from '@/components/Preloader';
import Scene from '@/components/Scene';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

import * as animations from '@/utils/animations';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
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
      wrapper: containerRef.current,  // Add this
      content: contentEl,             // Add this
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
      animations.checkReveals(lenisRef.current?.scroll || 0);
    };
    lenisRef.current?.on('scroll', handleLenis);

    // Resize for height changes
    const handleResize = () => lenisRef.current?.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      lenisRef.current?.off('scroll', handleLenis);
      lenisRef.current?.destroy();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      <main id="smooth-content" style={{ position: 'relative', zIndex: 1, minHeight: '500vh', overflowY: 'auto' }}>
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </main>
    </div>
  );
}