// app/blog/layout.tsx (Updated - Add popstate listener to force reload on back/forward navigation; integrate preloader logic if not already)
"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import BlogScene from "@/components/BlogScene";
import BlogPreloader from "@/components/BlogPreloader"; // Ensure import if added

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // 1.5s force load on mount (preloader timeout)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // NEW: Force full reload on back/forward navigation (popstate) to ensure fresh load with preloader
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload(); // Triggers fresh server-side load and preloader
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div style={{ position: "relative", height: "100vh", overflow: "hidden" }}>
      {" "}
      {/* Full viewport */}
      {!isLoaded && <BlogPreloader />} {/* Show preloader until timeout */}
      <div
        id="canvas-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 1.7], fov: 75 }} // Decreased z=10 to bring model closer (test: 8-12 if still far)
          gl={{ antialias: !isMobile, alpha: true }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <BlogScene isMobile={isMobile} />
        </Canvas>
      </div>
      <main
        style={{
          position: "relative",
          zIndex: 1,
          overflowY: "auto",
          height: "100%",
        }}
      >
        {" "}
        {/* Content scrolls */}
        {children}
      </main>
    </div>
  );
}
