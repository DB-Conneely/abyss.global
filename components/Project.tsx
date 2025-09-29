// components/Project.tsx (Updated - Add videoId prop; render iframe with wrapper below image; no other changes)
import React from "react";
import Image from "next/image"; // NEW: Import for optimized images

// Define the props the component expects
interface ProjectProps {
  title: string;
  description: string;
  imageUrl?: string; // Optional single image
  links?: { label: string; url: string }[]; // Optional array for multiple links
  index: number; // To identify the project for events/animations
  videoId?: string; // NEW: Optional YouTube video ID for embed
}
const Project: React.FC<ProjectProps> = ({
  title,
  description,
  imageUrl = "/abyss-logo.png",
  links = [],
  index,
  videoId,
}) => {
  return (
    <section className="section" id={`project-${index}`}>
      <div className="project-container">
        {" "}
        {/* New translucent container */}
        <div className="project-header">
          <h2 className="glow">{title}</h2>
        </div>
        <div className="project-body">
          {" "}
          {/* New row for horizontal split */}
          <div className="project-images">
            {" "}
            {/* Left 1/3: Single centered image */}
            <div className="project-image-wrapper"> {/* NEW: Wrapper for isolated fill */}
              <Image
                src={imageUrl}
                alt="Project Image"
                className="project-image"
                fill // Use fill for responsive scaling without fixed width/height
                sizes="(max-width: 768px) 100vw, 33vw" // Responsive sizes (full on mobile, ~1/3 on desktop)
                priority // Eager load to ensure visibility (good for key content)
              />
            </div>
            {videoId && ( // NEW: Conditional embed below image
              <div className="video-wrapper">
                {" "}
                {/* Wrapper for 16:9 aspect */}
                <iframe
                  className="project-video"
                  src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                  title={`${title} Video Demo`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy" // Lazy load for perf
                />
              </div>
            )}
          </div>
          <div className="project-text">
            {" "}
            {/* Right 2/3: Informational text */}
            {description.split("\n").map((line, idx) => (
              <p key={idx}>{line.trim()}</p> // Each \n becomes new <p> with margin
            ))}
          </div>
        </div>
        <div className="project-footer">
          {" "}
          {/* Bottom footer with links separated by ' | ' */}
          {links.length > 0 ? (
            links.map((link, idx) => (
              <React.Fragment key={idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="submit-button"
                >
                  {link.label}
                </a>{" "}
                {/* Updated: Use submit-button class */}
              </React.Fragment>
            ))
          ) : (
            <>
              <a
                href="#video"
                target="_blank"
                rel="noopener noreferrer"
                className="submit-button"
              >
                Video Demo
              </a>
              <a
                href="#repo"
                target="_blank"
                rel="noopener noreferrer"
                className="submit-button"
              >
                GitHub Repo
              </a>
              <a
                href="#docs"
                target="_blank"
                rel="noopener noreferrer"
                className="submit-button"
              >
                Docs
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
export default Project;