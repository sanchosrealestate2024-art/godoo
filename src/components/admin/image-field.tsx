"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadImage } from "@/lib/upload";

export function ImageField({
  bucket,
  folder,
  label,
  name,
  defaultValue,
}: {
  bucket: string;
  folder?: string;
  label: string;
  name: string;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const { url } = await uploadImage(bucket, file, folder);
      setValue(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="eyebrow mb-2 block">{label}</label>
      <input type="hidden" name={name} value={value} />
      {value ? (
        <div className="relative h-20 w-20 overflow-hidden border border-white/20">
          <Image src={value} alt="" fill className="object-cover" />
          <button
            type="button"
            onClick={() => setValue("")}
            className="absolute right-0.5 top-0.5 rounded-full bg-obsidian/80 p-0.5 text-white hover:text-red-400"
            aria-label="Remove image"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-20 w-20 items-center justify-center border-2 border-dashed border-white/20 text-white/40 hover:border-white hover:text-white"
        >
          {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
