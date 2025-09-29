// components/Footer.tsx (Final Version)

import React from "react";

const Footer: React.FC = () => {
  const linkStyle = { color: "inherit", textDecoration: "underline" };

  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        padding: "2rem",
        textAlign: "center",
        backgroundColor: "var(--background)",
        color: "var(--text)",
        fontSize: "0.875rem",
        width: "100%",
      }}
    >
      <p>© 2025 Abyss Global. All rights reserved.</p>

      {/* --- ADDED CREDITS SECTION --- */}
      <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "1rem" }}>
        <a
          href="https://sketchfab.com/3d-models/earth-3684eb40fb7e42208089874e6286b9e9"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          &quot;Earth&quot;
        </a>{" "}
        by denis_cliofas &{" "}
        <a
          href="https://sketchfab.com/3d-models/space-boi-f6a8c6a6727b4f2cb020c8b50bb2ee60"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          &quot;space boi&quot;
        </a>{" "}
        by silvercrow101, licensed under{" "}
        <a
          href="http://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          rel="noopener noreferrer"
          style={linkStyle}
        >
          CC Attribution
        </a>
        .
      </p>
    </footer>
  );
};

export default Footer;