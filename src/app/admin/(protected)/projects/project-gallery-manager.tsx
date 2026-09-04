"use client";

import { useRef, useState, useTransition } from "react";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Upload, X, Loader2, GripVertical } from "lucide-react";
import { uploadImage } from "@/lib/upload";
import type { ImageKind, ProjectImage } from "@/types/database";
import { addProjectImage, deleteProjectImage, reorderProjectImages } from "./actions";

const KINDS: { value: ImageKind; label: string }[] = [
  { value: "gallery", label: "Gallery" },
  { value: "blueprint", label: "Blueprints" },
  { value: "floor_plan", label: "Floor Plans" },
  { value: "construction", label: "Construction" },
  { value: "before", label: "Before" },
  { value: "after", label: "After" },
];

function SortableImage({ image, onDelete }: { image: ProjectImage; onDelete: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="group relative aspect-square overflow-hidden border border-white/10 bg-obsidian-panel"
    >
      <Image src={image.image_url} alt="" fill className="object-cover" />
      <button
        {...attributes}
        {...listeners}
        className="absolute left-1 top-1 cursor-grab rounded bg-obsidian/80 p-1 text-white active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical size={14} />
      </button>
      <button
        onClick={() => onDelete(image.id)}
        className="absolute right-1 top-1 rounded bg-obsidian/80 p-1 text-white hover:text-red-400"
        aria-label="Delete image"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function ProjectGalleryManager({
  projectId,
  images,
}: {
  projectId: string;
  images: ProjectImage[];
}) {
  const [activeKind, setActiveKind] = useState<ImageKind>("gallery");
  const [items, setItems] = useState(images);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, startTransition] = useTransition();

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const filtered = items
    .filter((i) => i.kind === activeKind)
    .sort((a, b) => a.display_order - b.display_order);

  async function handleFiles(files: FileList) {
    setUploading(true);
    try {
      const startOrder = filtered.length;
      for (let i = 0; i < files.length; i++) {
        const { url } = await uploadImage("project-images", files[i], `${projectId}/${activeKind}`);
        const result = await addProjectImage(projectId, url, activeKind, startOrder + i);
        if (!("error" in result) || !result.error) {
          setItems((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              project_id: projectId,
              image_url: url,
              caption: null,
              kind: activeKind,
              display_order: startOrder + i,
              created_at: new Date().toISOString(),
            },
          ]);
        }
      }
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(imageId: string) {
    setItems((prev) => prev.filter((i) => i.id !== imageId));
    startTransition(() => {
      deleteProjectImage(imageId, projectId);
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = filtered.findIndex((i) => i.id === active.id);
    const newIndex = filtered.findIndex((i) => i.id === over.id);
    const reordered = arrayMove(filtered, oldIndex, newIndex);

    setItems((prev) => [...prev.filter((i) => i.kind !== activeKind), ...reordered]);
    startTransition(() => {
      reorderProjectImages(projectId, reordered.map((i) => i.id));
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k.value}
            onClick={() => setActiveKind(k.value)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wide ${
              activeKind === k.value ? "bg-white text-obsidian" : "bg-obsidian-raised text-white/60"
            }`}
          >
            {k.label}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={filtered.map((i) => i.id)} strategy={rectSortingStrategy}>
            {filtered.map((image) => (
              <SortableImage key={image.id} image={image} onDelete={handleDelete} />
            ))}
          </SortableContext>
        </DndContext>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 border-2 border-dashed border-white/20 text-white/40 hover:border-white hover:text-white"
        >
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          <span className="text-[10px] uppercase">Add</span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
    </div>
  );
}
