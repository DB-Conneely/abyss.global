// components/ClientBlog.tsx (Updated - Style "Click to Read" links as submit-button; already is)
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // For page navigation
import gsap from "gsap";

interface Post {
  id: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
}

interface ClientBlogProps {
  posts: Post[];
  currentPage: number;
  totalPosts: number;
}

const POSTS_PER_PAGE = 9;

export default function ClientBlog({
  posts,
  currentPage,
  totalPosts,
}: ClientBlogProps) {
  const router = useRouter();
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = document.querySelectorAll(".section");
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target as HTMLElement;
          section.classList.add("visible");
          gsap.to(section, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
          });
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
      <h1 className="glow">Deep in the Abyss</h1>
      <p>
        A personal diary of ideas, theories, dev experiments and anything else
        that ends up here.
      </p>
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
      {totalPages > 1 && (
        <div className="pagination">
          {currentPage > 1 && (
            <button
              onClick={() => router.push(`/blog?page=${currentPage - 1}`)}
              className="submit-button"
            >
              Previous
            </button>
          )}
          {currentPage < totalPages && (
            <button
              onClick={() => router.push(`/blog?page=${currentPage + 1}`)}
              className="submit-button"
            >
              Next
            </button>
          )}
        </div>
      )}
    </section>
  );
}
