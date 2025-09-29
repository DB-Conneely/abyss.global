// app/blog/page.tsx (Updated - Add pagination with count fetch)
import ClientBlog from "@/components/ClientBlog";
import { supabase } from "@/utils/supabase";

const POSTS_PER_PAGE = 9;

interface Post {
  id: string;
  title: string;
  description: string;
  slug: string;
  created_at: string;
}

export const revalidate = 60;

async function getPosts(page: number = 1) {
  const from = (page - 1) * POSTS_PER_PAGE;
  const to = from + POSTS_PER_PAGE - 1;

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return { posts: [], total: 0 };

  const { count } = await supabase
    .from("posts")
    .select("*", { count: "exact" });
  return { posts: posts || [], total: count || 0 };
}

export default async function Blog({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const { posts, total } = await getPosts(page);
  return <ClientBlog posts={posts} currentPage={page} totalPosts={total} />;
}
