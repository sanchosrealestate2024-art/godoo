import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Video,
  Image as ImageIcon,
  Newspaper,
  Quote,
  Wrench,
  Users,
  Settings as SettingsIcon,
  Mail,
  LogOut,
} from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { signOut } from "../login/actions";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: Building2 },
  { href: "/admin/videos", label: "Videos", icon: Video },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/services", label: "Services", icon: Wrench },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: SettingsIcon },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireStaff();

  return (
    <div className="flex min-h-screen bg-obsidian text-white">
      <aside className="hidden w-64 flex-shrink-0 border-r border-white/10 bg-obsidian-raised md:block">
        <div className="p-6">
          <p className="font-display text-xl">GODOO Studio</p>
          <p className="mt-1 text-xs text-white/50 capitalize">{profile.role.replace("_", " ")}</p>
        </div>
        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded px-3 py-2 text-sm text-white/70 transition-colors hover:bg-obsidian-panel hover:text-white"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="mt-6 px-3">
          <button className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-white/50 hover:bg-obsidian-panel hover:text-red-400">
            <LogOut size={16} />
            Sign Out
          </button>
        </form>
      </aside>
      <main className="flex-1 overflow-x-hidden p-6 md:p-10">{children}</main>
    </div>
  );
}
