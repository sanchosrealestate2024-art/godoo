# GODOO Architecture Studio — CMS-Powered Website

Next.js 15 + React 19 + Supabase. Every page is fully dynamic — no hardcoded
projects, content, or images. Manage everything from `/admin`.

## 1. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the two migration files **in order**:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_storage.sql`
3. Go to Settings → API and copy your Project URL, anon key, and service role key.

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and
`SUPABASE_SERVICE_ROLE_KEY`.

## 3. Install and run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`.

## 4. Create your first admin account

Supabase Auth doesn't have a public sign-up form on this site by design — admin
accounts are created directly in Supabase:

1. In the Supabase dashboard: Authentication → Users → **Add user** (set an email + password).
2. In the SQL Editor, promote that user:
   ```sql
   update public.profiles set role = 'super_admin' where id = 'the-user-uuid';
   ```
   (A `profiles` row is auto-created for every new auth user — you're just upgrading the role.)
3. Log in at `/admin/login`.

## 5. (Optional) Seed starter content

```bash
npm run seed
```

This adds your two real projects (Bank Headquarters, Hospital with Vernacular
Architecture) and base settings. Add their images/videos from `/admin/projects`.

## Project structure

- `src/app` — routes (public site + `/admin` CMS), all Server Components by default
- `src/components` — UI, split by section (`home`, `project-detail`, `projects`, `admin`, `layout`)
- `src/lib/data` — server-side Supabase queries (the "read" side)
- `src/lib/supabase` — client/server/admin Supabase client factories
- `src/lib/upload.ts` — client-side image compression + Storage upload
- `supabase/migrations` — schema + RLS + storage bucket policies

## Roles

- **super_admin / admin** — full CRUD, can delete content, edit Settings
- **editor** — can create/edit content, cannot delete or touch Settings

## Design system

Charcoal/gold palette, Playfair Display + Montserrat, defined in
`tailwind.config.ts` and `src/app/globals.css`. Framer Motion, GSAP
(horizontal scroll gallery + ScrollTrigger), and Lenis (smooth scroll) are
wired in at the layout/component level — swap visuals by editing components,
not by touching the data layer.

## What's next

Send real photography, project details, and copy — everything flows into
Supabase tables via `/admin`, so no code changes are needed to update content.
