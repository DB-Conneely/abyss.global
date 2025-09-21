// components/Project.tsx
import React from 'react';

// Define the props the component expects
interface ProjectProps {
  title: string;
  description: string;
  imageUrl?: string; // Optional image
  projectLink?: string; // Optional link
  index: number; // To identify the project for events/animations
}

const Project: React.FC<ProjectProps> = ({ title, description, imageUrl, projectLink, index }) => {
  return (
    <section className="section" id={`project-${index}`}>
      <h2 className="glow">{title}</h2>
      {imageUrl && <img src={imageUrl} alt={title} style={{ maxWidth: '100%', height: 'auto', marginBottom: '1rem' }} />}
      <p>{description}</p>
      {projectLink && (
        <a href={projectLink} target="_blank" rel="noopener noreferrer" style={{ marginTop: '1rem', display: 'inline-block', color: 'var(--accent)' }}>
          Explore Project
        </a>
      )}
    </section>
  );
};

export default Project;