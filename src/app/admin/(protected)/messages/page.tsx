import { createClient } from "@/lib/supabase/server";
import { MessageRow } from "./message-row";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: contacts } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-3xl">Messages</h1>
      <p className="mt-2 text-sm text-white/50">Inquiries submitted through the contact form.</p>

      <div className="mt-8 space-y-3">
        {(contacts ?? []).map((c) => (
          <MessageRow key={c.id} contact={c} />
        ))}
        {(contacts ?? []).length === 0 && (
          <p className="mt-10 text-center text-white/50">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
