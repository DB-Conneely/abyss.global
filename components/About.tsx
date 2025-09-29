// components/About.tsx
"use client"; // NEW: Add for client-side dispatchEvent
import React from "react";
import Link from "next/link"; // NEW: Import for navigation

const About: React.FC = () => {
  const handleScrollToContact = () => {
    document.body.dispatchEvent(
      new CustomEvent("scrollToHash", { detail: { hash: "contact" } }),
    );
  };
  return (
    <section className="section" id="about">
      <h2 className="glow">About Abyss</h2>
      <p>
        Welcome to my digital space. This site serves as a real-time portfolio
        of my development journey, which began in June 2024 with a simple
        &apos;Hello World&apos;.
      </p>

      <p>
        My approach to building software is a partnership. I act as the director
        and architect, leveraging AI as a development partner to execute a clear
        vision. This modern, augmented workflow allows me to accelerate what was
        previously only possible with years of traditional experience, enabling
        rapid experimentation and the creation of complex, end-to-end
        applications.
      </p>

      <p>
        All projects showcased here are solo endeavors, born from a drive to
        build tools that are exciting and useful. Each one is a step forward in
        refining my ability to design and deliver high-quality solutions. For a
        more in-depth look into my thoughts, experiments, and development
        philosophy, I invite you to explore the blog section - this will be
        updated sporadically dependent on when I have something to discuss.
      </p>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}> {/* NEW: Flex wrapper for side-by-side buttons */}
        <Link
          href="/blog"
          className="submit-button"
        >
          Check the Blog!
        </Link>
        <button
          onClick={handleScrollToContact} // NEW: Dispatch for smooth scroll to #contact
          className="work-button"
        >
          Work With Me 🤝
        </button>
      </div>
    </section>
  );
};

export default About;