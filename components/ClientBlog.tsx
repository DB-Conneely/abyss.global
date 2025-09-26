// components/ClientBlog.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

interface Post {
  id: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
}

interface ClientBlogProps {
  posts: Post[];
}

export default function ClientBlog({ posts }: ClientBlogProps) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = document.querySelectorAll('.section');
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target as HTMLElement;
          section.classList.add('visible');
          gsap.to(section, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
          observer.unobserve(section);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <section className="section" id="blog">
      <h1 className="glow">Into the Abyss: Thoughts from the Void</h1>
      <p>A personal diary of ideas, dev experiments, and cosmic musings—updated sporadically.</p>
      {posts.length > 0 ? (
        <div className="blog-posts-container">
          {posts.map((post) => (
            <div key={post.id} className="project-container">
              <h2 className="glow">{post.title}</h2>
              <p>{post.description}</p>
              <Link href={`/blog/${post.slug}`} className="submit-button">
                Click to Read
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts found yet—check back soon!</p>
      )}
    </section>
  );
}