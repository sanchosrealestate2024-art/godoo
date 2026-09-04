import { createClient } from "@/lib/supabase/server";
import { ImageField } from "@/components/admin/image-field";
import { TeamMemberRow } from "./team-member-row";
import { createTeamMember } from "./actions";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const { data: team } = await supabase.from("team").select("*").order("display_order");

  return (
    <div>
      <h1 className="font-display text-3xl">Team</h1>

      <div className="mt-8 space-y-3">
        {(team ?? []).map((member) => (
          <TeamMemberRow key={member.id} member={member} />
        ))}
      </div>

      <div className="mt-10 max-w-xl border-t border-white/10 pt-8">
        <h2 className="font-display mb-4 text-xl">Add Team Member</h2>
        <form
          action={async (formData: FormData) => {
            "use server";
            await createTeamMember(formData);
          }}
          className="space-y-4"
        >
          <ImageField bucket="team" label="Photo" name="photo" />
          <input
            name="name"
            placeholder="Name"
            required
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
          <input
            name="role"
            placeholder="Role (e.g. Principal Architect)"
            className="w-full border border-white/15 bg-obsidian-raised p-3 text-white focus:border-white focus:outline-none"
          />
          <textarea
            name="bio"
            placeholder="Bio"
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
            Add Member
          </button>
        </form>
      </div>
    </div>
  );
}
