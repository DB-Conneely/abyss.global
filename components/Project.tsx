// components/Project.tsx
import React from 'react';

// Define the props the component expects
interface ProjectProps {
  title: string;
  description: string;
  imageUrl?: string; // Optional single image
  links?: { label: string; url: string }[]; // Optional array for multiple links
  index: number; // To identify the project for events/animations
}

const Project: React.FC<ProjectProps> = ({ title, description, imageUrl = "/abyss-logo.png", links = [], index }) => {
  return (
    <section className="section" id={`project-${index}`}>
      <div className="project-container"> {/* New translucent container */}
        <div className="project-header">
          <h2 className="glow">{title}</h2>
        </div>
        <div className="project-body"> {/* New row for horizontal split */}
          <div className="project-images"> {/* Left 1/3: Single centered image */}
            <img src={imageUrl} alt="Project Image" className="project-image" />
          </div>
          <div className="project-text"> {/* Right 2/3: Informational text */}
          {description.split('\n').map((line, idx) => (
            <p key={idx}>{line.trim()}</p> // Each \n becomes new <p> with margin
          ))}
        </div>
        </div>
        <div className="project-footer"> {/* Bottom footer with links separated by ' | ' */}
          {links.length > 0 ? links.map((link, idx) => (
            <React.Fragment key={idx}>
              <a href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>
              {idx < links.length - 1 && <span> | </span>} {/* Single | between links */}
            </React.Fragment>
          )) : (
            <>
              <a href="#video" target="_blank" rel="noopener noreferrer">Video Demo</a>
              <span> | </span>
              <a href="#repo" target="_blank" rel="noopener noreferrer">GitHub Repo</a>
              <span> | </span>
              <a href="#docs" target="_blank" rel="noopener noreferrer">Docs</a>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Project;