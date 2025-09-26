// app/blog/page.tsx
import Link from 'next/link';
import { supabase } from '@/utils/supabase'; // Your client

interface Post {
  id: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
}

export default async function Blog() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return <div>Error loading blog posts.</div>; // Basic error UI
  }

  return (
    <section className="section" id="blog">
      <h1 className="glow">Into the Abyss: Thoughts from the Void</h1>
      <p>A personal diary of ideas, dev experiments, and cosmic musings—updated sporadically.</p>
      {posts && posts.length > 0 ? (
        <div className="blog-posts-container"> {/* Wrapper for grid/list */}
          {posts.map((post: Post) => (
            <div key={post.id} className="project-container"> {/* Reuse project styles for consistency */}
              <h2 className="glow">{post.title}</h2>
              <p>{post.description}</p>
              <Link href={`/blog/${post.slug}`} className="submit-button"> {/* Reuse button style */}
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