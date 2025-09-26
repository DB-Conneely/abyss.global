// app/blog/page.tsx
import ClientBlog from '@/components/ClientBlog'; // New client wrapper
import { supabase } from '@/utils/supabase';

interface Post {
  id: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
}

export const revalidate = 60; // ISR: Revalidate every 60s

async function getPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('All posts fetch:', { posts, error }); // Debug
  if (error) return [];
  return posts || [];
}



export default async function Blog() {
  const posts = await getPosts();
  return <ClientBlog posts={posts} />;
}