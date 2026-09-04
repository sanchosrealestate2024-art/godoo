import type { ProjectWithMedia } from "@/types/database";

export function ProjectInfo({ project }: { project: ProjectWithMedia }) {
  const fields = [
    { label: "Location", value: project.location },
    { label: "Client", value: project.client },
    { label: "Architect", value: project.architect },
    { label: "Year", value: project.year?.toString() },
    { label: "Area", value: project.area },
    { label: "Status", value: project.status?.replace("_", " ") },
  ].filter((f) => f.value);

  return (
    <section className="bg-obsidian px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
        {project.description && (
          <p className="text-lg leading-relaxed text-white/80 md:col-span-2">
            {project.description}
          </p>
        )}
        <dl className="grid grid-cols-2 gap-6">
          {fields.map((f) => (
            <div key={f.label}>
              <dt className="eyebrow mb-1">{f.label}</dt>
              <dd className="text-sm capitalize text-white">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
