import { createClient } from "@/lib/supabase/server";
import { ImageField } from "@/components/admin/image-field";
import { DeleteRowButton } from "@/components/admin/delete-row-button";
import { createService, deleteService } from "./actions";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const { data: services } = await supabase.from("services").select("*").order("display_order");

  return (
    <div>
      <h1 className="font-display text-3xl">Services</h1>

      <div className="mt-8 space-y-3">
        {(services ?? []).map((s) => (
          <div key={s.id} className="flex items-start justify-between gap-4 border border-white/10 bg-obsidian-raised p-4">
            <div>
              <p className="text-sm text-white">{s.title}</p>
              {s.description && <p className="mt-1 text-xs text-white/50">{s.description}</p>}
            </div>
            <DeleteRowButton action={deleteService.bind(null, s.id)} />
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-xl border-t border-white/10 pt-8">
        <h2 className="font-display mb-4 text-xl">Add Service</h2>
        <form
          action={async (formData: FormData) => {
            "use server";
            await createService(formData);
          }}
          className="space-y-4"
        >
          <ImageField bucket="team" folder="services" label="Image" name="image" />
          <input
            name="title"
            placeholder="Service Title"
            required
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
          <input
            name="icon"
            placeholder="Icon name (lucide-react, e.g. 'compass')"
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={3}
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
          <input
            name="display_order"
            type="number"
            placeholder="Order"
            defaultValue={0}
            className="w-24 border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
          <button className="border border-white/50 px-6 py-2 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-obsidian">
            Add Service
          </button>
        </form>
      </div>
    </div>
  );
}
