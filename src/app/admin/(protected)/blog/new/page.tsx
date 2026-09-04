import { createBlog } from "../actions";
import { BlogForm } from "../blog-form";

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">New Post</h1>
      <div className="mt-8">
        <BlogForm action={createBlog} />
      </div>
    </div>
  );
}
