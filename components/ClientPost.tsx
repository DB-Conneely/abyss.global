// components/ClientPost.tsx
'use client';
import React, { useEffect } from 'react'; // Add useEffect import
import { useRouter } from 'next/navigation';
import gsap from 'gsap'; // Import gsap if not already global

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  created_at: string;
}

interface ClientPostProps {
  post: Post;
}

export default function ClientPost({ post }: ClientPostProps) {
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const section = document.querySelector('#post');
    if (section) {
      section.classList.add('visible'); // Add class for CSS transition
      gsap.to(section, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
    }
  }, []); // Runs once on mount

  return (
    <section className="section" id="post">
      <h1 className="glow">{post.title}</h1>
      <p>{post.content}</p> {/* Full content as text; add markdown rendering later if needed */}
      <button onClick={() => router.back()} className="submit-button">
        Back to Blog
      </button>
    </section>
  );
}