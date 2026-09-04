import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectForm } from "../project-form";
import { ProjectGalleryManager } from "../project-gallery-manager";
import { ProjectVideoManager } from "../project-video-manager";
import { updateProject } from "../actions";
import { DeleteProjectButton } from "./delete-button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  if (!project) notFound();

  const { data: images } = await supabase
    .from("project_images")
    .select("*")
    .eq("project_id", id)
    .order("display_order", { ascending: true });

  const { data: videos } = await supabase
    .from("project_videos")
    .select("*")
    .eq("project_id", id)
    .order("display_order", { ascending: true });

  const boundUpdate = updateProject.bind(null, id);

  return (
    <div className="space-y-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">{project.title}</h1>
        <DeleteProjectButton projectId={project.id} />
      </div>

      <ProjectForm project={project} action={boundUpdate} />

      <div>
        <h2 className="font-display mb-4 text-xl">Images</h2>
        <ProjectGalleryManager projectId={id} images={images ?? []} />
      </div>

      <div>
        <h2 className="font-display mb-4 text-xl">Videos</h2>
        <ProjectVideoManager projectId={id} videos={videos ?? []} />
      </div>
    </div>
  );
}
