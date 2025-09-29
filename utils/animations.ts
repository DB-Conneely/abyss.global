import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

type HeroRefs = {
  hero: THREE.Group | null;
  asteroids: THREE.InstancedMesh | null;
  camera: THREE.PerspectiveCamera;
  dummyAsteroids?: THREE.Object3D[];
};

// Hero open: Explicit props for Vector3/Euler (Fix: No "invalid property x/y/z")
export const heroOpen = (
  heroRef: THREE.Group | null,
  asteroidsRef: THREE.InstancedMesh | null,
  camera: THREE.PerspectiveCamera,
) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    camera.position.z = 10;
    document.body.dispatchEvent(new CustomEvent("heroOpened"));
    return;
  }

  const tl = gsap.timeline({
    defaults: { duration: 2, ease: "power3.out" },
    onComplete: () => {
      document.body.dispatchEvent(new CustomEvent("heroOpened"));
      document.body.dispatchEvent(new CustomEvent("assetsLoaded"));
    },
  });

  // Hero pulse/rotate
  if (heroRef) {
    tl.fromTo(
      heroRef.scale,
      { x: 0.5, y: 0.5, z: 0.5 },
      { x: 1, y: 1, z: 1 },
      0,
    );
    tl.to(heroRef.rotation, { y: Math.PI * 2, duration: 3 }, 0); // Explicit y for Euler
  }

  // Camera pullback: Explicit z for Vector3
  tl.fromTo(camera.position, { z: 2 }, { z: 10 }, 0);

  // Fade in the hero section container and then animate the text
  tl.to(".section#hero", { opacity: 1, duration: 1.5 }, 0.5);
  tl.fromTo(
    [".section#hero h1", ".section#hero p"],
    { opacity: 0, y: 50 },
    { opacity: 1, y: 0, duration: 1, stagger: 0.3, ease: "power3.out" },
    1,
  );
};

// Scroll reveals
export const checkReveals = (scrollY: number) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const sections = document.querySelectorAll(".section:not(#hero)");
  sections.forEach((section, index) => {
    if (
      ScrollTrigger.isInViewport(section) &&
      gsap.getProperty(section, "opacity") === 0
    ) {
      gsap.to(section, { opacity: 1, y: 0, duration: 1 });
      document.body.dispatchEvent(
        new CustomEvent("sectionBurst", { detail: { index } }),
      );
    }
  });
};

// CTA burst
export const ctaBurst = (camera: THREE.PerspectiveCamera) => {
  gsap.to(camera.position, {
    z: 5,
    duration: 1,
    ease: "power2.inOut",
    yoyo: true,
    repeat: 1,
  });
  document.body.dispatchEvent(
    new CustomEvent("particleBurst", { detail: { count: 200 } }),
  );
};

// Add listener for custom scrollToHash event (triggers Lenis smooth scroll if available)
export const initHashScroll = (lenis?: any) => {
  document.body.addEventListener("scrollToHash", (e: Event) => {
    const customEvent = e as CustomEvent;
    const hash = customEvent.detail.hash;
    if (lenis) {
      lenis.scrollTo(`#${hash}`, {
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
};
