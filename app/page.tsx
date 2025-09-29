// app/page.tsx (Updated - Add videoId to Projects 1/2; remove Video Demo from all links; no other changes)
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
  // NEW: Force full reload on back/forward navigation (popstate) to ensure fresh load with preloader
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload(); // Triggers fresh server-side load and preloader
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
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
          description={`IntuAItive is a full-stack SaaS application designed to solve a common inefficiency: the manual process of note-taking from audio. Inspired by the need to automate tedious administrative tasks, this platform transforms audio from meetings, lectures, and recordings into structured, actionable intelligence.

          It handles diverse audio sources, including YouTube URLs, file uploads, and live recordings and leverages AI for highly accurate transcription and summarization. A standout feature is the customizable "Tones" system, which allows users to tailor the summary's focus for different professional contexts, such as business, sales, or academic use, demonstrating a deep understanding of user-centric design and prompt engineering.

          This project is a testament to a modern, AI-augmented workflow, showcasing the ability to rapidly design, develop, and deploy a complex, end-to-end application. It effectively demonstrates full-stack capabilities, sophisticated AI integration, and a seamless user experience from input to insight.
          
          Currently, project is not publicly deployed - but was built with deployment in mind. Please see the GitHub repo for full details and a comprehensive video demo.`}
          imageUrl="/waverob.png" // Unique images per project
          videoId="vsZa6hAXyZ4" // NEW: Add videoId for embed
          links={[
            { label: "GitHub Repo", url: "https://github.com/DB-Conneely/AISummary-Project" }, // Removed Video Demo
          ]}
        />
        <Project
          index={2}
          title="Flash Solana"
          description={`Flash is a fully deployed Telegram trading bot for the Solana ecosystem, architected and built end-to-end from a user-first perspective. The goal was to abstract away the complexities of native DEX trading and create an intuitive, entry-level tool for beginners.

          Operating entirely within Telegram, the bot allows users to securely connect an existing wallet or generate a new one. Trades are executed seamlessly through a simple command and button interface, integrating with the Jupiter DEX API for reliable swaps. Users can also track their portfolio and adjust key trading parameters like slippage.

          The tech stack includes TypeScript, MongoDB for data persistence, Redis for high-speed state management, and the Solana web3.js library. A commitment to reliability is demonstrated through a suite of 61 passing Jest tests. The entire application is Dockerized and deployed, showcasing the ability to deliver and maintain a live, production-ready MVP. This project serves as a strong foundation for future Web3 ventures.
         
          Please watch video demo to see it in action, or try it out yourself via the link below!`}
          imageUrl="/flash.png" // Different images later
          videoId="iJOtwT8uimE" // NEW: Add videoId for embed
          links={[
            { label: "GitHub Repo", url: "https://github.com/DB-Conneely/flash-sol" }, // Removed Video Demo
            { label: "WHY NOT TRY!", url: "https://t.me/flashsol_bot" }
          ]}
        />
        <Project
          index={3}
          title="Current Projects"
          description={`My current focus is on exploring the frontiers of AI integration and developer automation. I'm actively experimenting with new ideas, including workflow tools like n8n and building autonomous agents.

          A key project in development is cli-auto, an experimental AI agent designed to automate the entire initial phase of software development. It takes high-level user requirements through a simple questionnaire, then uses an AI-driven chain of thought to generate a complete project vision, a detailed development roadmap, and the entire initial codebase structure. From there, it's designed to enter an autonomous loop of writing and refining code based on the generated plan.

          These projects are a reflection of my passion for rapid experimentation and leveraging AI to enhance development workflows. My main goal in this field is to just keep building tools that are exciting and/or useful to me and in turn improve on my ability to produce better quality solutions. You can follow their progress and see my latest ideas taking shape on my GitHub profile.`}
          imageUrl="/abyss-logo.png" // Different images later
          links={[
            { label: "GitHub Profile", url: "https://github.com/DB-Conneely" }, // Removed Video Demo
          ]}
        />
        <Contact />
        {/* Footer is placed last and should now sit correctly at the end */}
        <Footer />
      </main>
    </div>
  );
}