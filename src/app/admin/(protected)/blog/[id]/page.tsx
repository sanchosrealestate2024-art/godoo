import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BlogForm } from "../blog-form";
import { updateBlog, deleteBlog } from "../actions";
import { DeleteRowButton } from "@/components/admin/delete-row-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: blog } = await supabase.from("blogs").select("*").eq("id", id).maybeSingle();
  if (!blog) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">{blog.title}</h1>
        <DeleteRowButton action={deleteBlog.bind(null, id)} />
      </div>
      <div className="mt-8">
        <BlogForm blog={blog} action={updateBlog.bind(null, id)} />
      </div>
    </div>
  );
}
