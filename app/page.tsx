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
        {/* Project instances with unique data */}
        <Project
          index={1}
          title="IntuAItive"
          description={`IntuAItive is a full-stack SaaS application that transforms audio from meetings, lectures, podcasts, and recordings into actionable insights. Leveraging advanced AI for transcription and summarization, it processes YouTube URLs, uploaded MP4/M4A files, or live recordings—delivering sentiment analysis, overviews, customizable bullet summaries, and full transcripts. With support for real-time transcription and tailored tones (e.g., Business, Student, Custom), it streamlines productivity for professionals, students, and creators in dynamic environments.
  
          This project showcases expertise in AI integration, real-time systems, secure authentication, and scalable full-stack development, making it an ideal demonstration of modern web engineering and machine learning applications. As well as systems architecture and Engineering to deliver this application end to end SOLO. Make sure to check out the video demo to see it in action!`}

          imageUrl="/waverob.png" // Unique images per project
          links={[
            { label: "Video Demo", url: "https://youtu.be/vsZa6hAXyZ4" },
            { label: "GitHub Repo", url: "https://github.com/DB-Conneely/AISummary-Project" },
          ]}
        />
        <Project
          index={2}
          title="Flash Solana"
          description={`Flash is a Telegram trading bot built on the solana ecosystem. The sole focus was to direct my current solana knowledge into a fun and useful project that could be used by others. The bot allows users to connect their solana wallet or generate a fresh wallet and execute trades via simple and beginner friendly commands/buttons in telegram. Users can also tracks their portfolio, adjust slippage and other such trading features. 
          
          Flash is built using Typescript, MongoDB and of course the Solana web3.js library - Winston-based logging for debugging, errors, and transactions, Redis for state management, locks, and security, 61 passing Jest tests ensure reliability, Dockerized and configured for Fly.io deployment.
          
          Please see the video demo to see it in action, or try it out yourself via the link below!`}
          imageUrl="/flash.png" // Different images later
          links={[
            { label: "Video Demo", url: "https://www.youtube.com/watch?v=iJOtwT8uimE" },
            { label: "GitHub Repo", url: "https://github.com/DB-Conneely/flash-sol" },
            { label: "WHY NOT TRY!", url: "https://t.me/flashsol_bot" }
          ]}
        />
        <Project
          index={3}
          title="Current Projects"
          description={`Please check back soon for updates on my latest projects! I'm continually working on new and exciting developments that I'll be sharing here. 
            
          I am Currently working on a few new ideas mostly around AI integration and automation, experimenting with n8n chatbots, no code tools and automated Agents. An example currently is the cli-auto tool, its in very early stages but its an auto development loop utilising prompt and context engineering to generate, test and refine code all from the command line. More to come on this soon!`}
          imageUrl="/abyss-logo.png" // Different images later
          links={[
            { label: "Video Demo", url: "#video-mission" },
            { label: "GitHub Profile", url: "https://github.com/DB-Conneely" },
          ]}
        />
        <Contact />
        {/* Footer is placed last and should now sit correctly at the end */}
        <Footer />
      </main>
    </div>
  );
}