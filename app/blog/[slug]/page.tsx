// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import ClientPost from "@/components/ClientPost"; // New client wrapper (for future effects)
import { supabase } from "@/utils/supabase";

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  created_at: string;
}

export const revalidate = 60; // ISR: Revalidate every 60s

async function getPost(slug: string) {
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single(); // Fetch one row

  if (error || !post) {
    console.error("Error fetching post:", error);
    notFound(); // Triggers 404 page
  }
  return post;
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  return <ClientPost post={post} />;
}
