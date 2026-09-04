"use client";

import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

const COMPRESS_OPTIONS = {
  maxSizeMB: 1.5,
  maxWidthOrHeight: 2400,
  useWebWorker: true,
  fileType: "image/webp" as const,
};

const THUMB_OPTIONS = {
  maxSizeMB: 0.15,
  maxWidthOrHeight: 480,
  useWebWorker: true,
  fileType: "image/webp" as const,
};

function fileExt(name: string, fallback = "webp") {
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()! : fallback;
}

function randomName(ext: string) {
  return `${crypto.randomUUID()}.${ext}`;
}

/**
 * Compresses an image client-side and uploads it to the given bucket/path.
 * Returns the public URL.
 */
export async function uploadImage(
  bucket: string,
  file: File,
  folder = ""
): Promise<{ url: string; path: string }> {
  const supabase = createClient();
  const compressed = await imageCompression(file, COMPRESS_OPTIONS);
  const path = `${folder ? `${folder}/` : ""}${randomName("webp")}`;

  const { error } = await supabase.storage.from(bucket).upload(path, compressed, {
    contentType: "image/webp",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

/** Generates and uploads a small thumbnail alongside the full image. */
export async function uploadImageWithThumbnail(bucket: string, file: File, folder = "") {
  const supabase = createClient();
  const [full, thumb] = await Promise.all([
    imageCompression(file, COMPRESS_OPTIONS),
    imageCompression(file, THUMB_OPTIONS),
  ]);

  const base = crypto.randomUUID();
  const fullPath = `${folder ? `${folder}/` : ""}${base}.webp`;
  const thumbPath = `${folder ? `${folder}/` : ""}${base}-thumb.webp`;

  const [fullRes, thumbRes] = await Promise.all([
    supabase.storage.from(bucket).upload(fullPath, full, { contentType: "image/webp" }),
    supabase.storage.from(bucket).upload(thumbPath, thumb, { contentType: "image/webp" }),
  ]);
  if (fullRes.error) throw fullRes.error;
  if (thumbRes.error) throw thumbRes.error;

  return {
    url: supabase.storage.from(bucket).getPublicUrl(fullPath).data.publicUrl,
    thumbnailUrl: supabase.storage.from(bucket).getPublicUrl(thumbPath).data.publicUrl,
  };
}

/** Uploads a video file (no client-side compression — large file support). */
export async function uploadVideo(
  bucket: string,
  file: File,
  folder = "",
  onProgress?: (pct: number) => void
): Promise<{ url: string; path: string }> {
  const supabase = createClient();
  const path = `${folder ? `${folder}/` : ""}${randomName(fileExt(file.name, "mp4"))}`;

  // Supabase JS v2 storage upload doesn't expose progress directly;
  // callers polling large uploads should chunk via TUS resumable upload
  // in a future iteration. onProgress is accepted for API stability.
  onProgress?.(0);
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  onProgress?.(100);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteFile(bucket: string, path: string) {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw error;
}
