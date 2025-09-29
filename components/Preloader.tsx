// components/Preloader.tsx (Updated - Remove .glow class from image; use new animation via .preloader-image)
import React from "react";
const Preloader: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "var(--background)",
        display: "flex",
        flexDirection: "column", // Stack image above text
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        color: "var(--text)",
        fontSize: "2rem",
        transition: "opacity 0.5s ease", // Basic CSS transition; GSAP overrides in utils
      }}
    >
      <img
        src="/abyss-logo.png"
        alt="Abyss Logo"
        className="preloader-image"
        style={{ marginBottom: "0.5rem" }}
      />{" "}
      {/* Remove glow class; use new image-specific */}
      <div className="glow" style={{ textAlign: "center" }}>
        ENTERING THE ABYSS...
      </div>{" "}
      {/* Remove nowrap to allow wrap */}
    </div>
  );
};
export default Preloader;
