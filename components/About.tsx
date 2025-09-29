// components/About.tsx
import React from "react";

const About: React.FC = () => {
  return (
    <section className="section" id="about">
      <h2 className="glow">About Abyss</h2>
      <p>
        Welcome to my digital space. This site serves as a real-time portfolio
        of my development journey, which began in June 2024 with a simple &apos;Hello
        World&apos;.
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
        updated sporadically with updates which may vary widely in quality :).
      </p>
    </section>
  );
};

export default About;