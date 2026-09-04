import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogBySlug, getSettings } from "@/lib/data/content";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import type { Metadata } from "next";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt ?? undefined };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const [post, settings] = await Promise.all([getBlogBySlug(slug), getSettings()]);
  if (!post) notFound();

  return (
    <>
      <SiteHeader companyName={settings?.company_name ?? "GODOO"} />
      <main className="min-h-screen bg-obsidian pb-24 pt-36">
        <article className="mx-auto max-w-3xl px-6 md:px-0">
          {post.author && <p className="eyebrow mb-3">{post.author}</p>}
          <h1 className="font-display text-4xl text-white md:text-5xl">{post.title}</h1>
          {post.cover_image && (
            <div className="relative mt-10 aspect-video overflow-hidden bg-obsidian-panel">
              <Image src={post.cover_image} alt={post.title} fill priority className="object-cover" />
            </div>
          )}
          {post.content && (
            <div
              className="prose prose-invert mt-10 max-w-none prose-headings:font-display prose-a:text-white"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}
        </article>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
