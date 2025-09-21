// components/Contact.tsx
import React from 'react';

const Contact: React.FC = () => {
  return (
    <section className="section" id="contact">
      <h2 className="glow">Signal Distress</h2>
      <p>Ready to chart a course together? Send a transmission.</p>
      <p>Placeholder for contact form or links (email, social media, etc.).</p>
      {/* Example link */}
      <a href="mailto:you@abyss.global" style={{ marginTop: '1rem', display: 'inline-block', color: 'var(--accent)' }}>you@abyss.global</a>
    </section>
  );
};

export default Contact;