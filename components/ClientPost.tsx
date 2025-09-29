// components/ClientPost.tsx (Updated)

"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const section = document.querySelector("#post");
    if (section) {
      section.classList.add("visible");
      gsap.to(section, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    }
  }, []);

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "GMT",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "GMT",
    };
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-GB", timeOptions);
    return `${formattedDate} | ${formattedTime} - GMT`;
  };

  return (
    <section className="section" id="post">
      <div className="post-container">
        <h1 className="glow">{post.title}</h1>
        <p
          style={{
            textAlign: "center",
            fontSize: "0.9rem",
            color: "#ccc",
            marginTop: "-2rem",
            marginBottom: "2rem",
          }}
        >
          Posted on {formatTimestamp(post.created_at)}
        </p>
        {post.content.split("\n").map((paragraph, index) => (
          <p key={index}>{paragraph.trim()}</p>
        ))}
        {/* --- UPDATED ONCLICK HANDLER --- */}
        <button onClick={() => router.push("/blog")} className="submit-button">
          Back to Blog
        </button>
      </div>
    </section>
  );
}
