import { createClient } from "@/lib/supabase/server";
import { ImageField } from "@/components/admin/image-field";
import { DeleteRowButton } from "@/components/admin/delete-row-button";
import { createTestimonial, deleteTestimonial } from "./actions";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase.from("testimonials").select("*").order("display_order");

  return (
    <div>
      <h1 className="font-display text-3xl">Testimonials</h1>

      <div className="mt-8 space-y-3">
        {(testimonials ?? []).map((t) => (
          <div key={t.id} className="flex items-start justify-between gap-4 border border-white/10 bg-obsidian-raised p-4">
            <div>
              <p className="text-sm text-white">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-2 text-xs text-white/50">
                {t.client_name}
                {t.company ? ` · ${t.company}` : ""}
              </p>
            </div>
            <DeleteRowButton action={deleteTestimonial.bind(null, t.id)} />
          </div>
        ))}
      </div>

      <div className="mt-10 max-w-xl border-t border-white/10 pt-8">
        <h2 className="font-display mb-4 text-xl">Add Testimonial</h2>
        <form
          action={async (formData: FormData) => {
            "use server";
            await createTestimonial(formData);
          }}
          className="space-y-4"
        >
          <ImageField bucket="team" folder="testimonials" label="Client Photo" name="image" />
          <input
            name="client_name"
            placeholder="Client Name"
            required
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
          <input
            name="company"
            placeholder="Company"
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
          <textarea
            name="quote"
            placeholder="Quote"
            required
            rows={3}
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
          <div className="flex items-center gap-6">
            <input
              name="display_order"
              type="number"
              placeholder="Order"
              defaultValue={0}
              className="w-24 border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
            />
            <label className="flex items-center gap-2 text-sm text-white/80">
              <input type="checkbox" name="published" defaultChecked className="accent-white" />
              Published
            </label>
          </div>
          <button className="border border-white/50 px-6 py-2 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-obsidian">
            Add Testimonial
          </button>
        </form>
      </div>
    </div>
  );
}
