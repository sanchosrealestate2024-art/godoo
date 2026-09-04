import Image from "next/image";
import Link from "next/link";
import { getPublishedBlogs } from "@/lib/data/content";
import { getSettings } from "@/lib/data/content";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const revalidate = 60;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam ?? "1") || 1;
  const [{ blogs, totalPages }, settings] = await Promise.all([
    getPublishedBlogs(page),
    getSettings(),
  ]);

  return (
    <>
      <SiteHeader companyName={settings?.company_name ?? "GODOO"} />
      <main className="min-h-screen bg-obsidian px-6 pb-24 pt-36 md:px-10">
        <div className="mx-auto max-w-7xl">
          <p className="eyebrow mb-3">Journal</p>
          <h1 className="font-display text-4xl text-white md:text-6xl">Insights &amp; Stories</h1>

          {blogs.length === 0 ? (
            <p className="mt-16 text-white/50">No articles published yet.</p>
          ) : (
            <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-obsidian-panel">
                    {post.cover_image && (
                      <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <h2 className="font-display mt-4 text-xl text-white">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 text-sm text-white/60">{post.excerpt}</p>}
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <p className="mt-14 text-center text-sm text-white/50">
              Page {page} of {totalPages}
            </p>
          )}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
