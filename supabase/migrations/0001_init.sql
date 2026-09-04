-- ============================================================
-- GODOO Architecture Studio — Core Schema
-- ============================================================

create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- ROLES / PROFILES
-- ------------------------------------------------------------
create type user_role as enum ('super_admin', 'admin', 'editor');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role user_role not null default 'editor',
  created_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'editor');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Helper: is the current user an admin (admin or super_admin)?
create function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'super_admin')
  );
$$ language sql security definer stable;

-- Helper: is the current user staff at all (any role incl. editor)?
create function public.is_staff()
returns boolean as $$
  select exists (select 1 from public.profiles where id = auth.uid());
$$ language sql security definer stable;

-- ------------------------------------------------------------
-- PROJECTS
-- ------------------------------------------------------------
create type project_status as enum ('draft', 'in_progress', 'completed', 'concept');

create table projects (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  description text,
  category text,
  location text,
  client text,
  architect text,
  year int,
  area text,
  status project_status not null default 'draft',
  featured boolean not null default false,
  published boolean not null default false,
  cover_image text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_published_idx on projects (published, featured, display_order);
create index projects_slug_idx on projects (slug);
create index projects_category_idx on projects (category);

create table project_images (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  image_url text not null,
  caption text,
  kind text not null default 'gallery', -- gallery | blueprint | floor_plan | construction | before | after
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index project_images_project_idx on project_images (project_id, kind, display_order);

create table project_videos (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  video_url text not null,
  thumbnail text,
  title text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index project_videos_project_idx on project_videos (project_id, display_order);

-- ------------------------------------------------------------
-- SERVICES
-- ------------------------------------------------------------
create table services (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  icon text,
  image text,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- TESTIMONIALS
-- ------------------------------------------------------------
create table testimonials (
  id uuid primary key default uuid_generate_v4(),
  client_name text not null,
  company text,
  image text,
  quote text not null,
  published boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- BLOGS
-- ------------------------------------------------------------
create table blogs (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  cover_image text,
  excerpt text,
  content text,
  author text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blogs_published_idx on blogs (published, published_at desc);

-- ------------------------------------------------------------
-- TEAM
-- ------------------------------------------------------------
create table team (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  photo text,
  bio text,
  display_order int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- CLIENT LOGOS
-- ------------------------------------------------------------
create table client_logos (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text not null,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------
-- SETTINGS (single-row key/value style table)
-- ------------------------------------------------------------
create table settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'GODOO Architecture Studio',
  logo_url text,
  email text,
  phone text,
  address text,
  social_instagram text,
  social_facebook text,
  social_linkedin text,
  social_youtube text,
  social_tiktok text,
  seo_title text,
  seo_description text,
  seo_og_image text,
  stats_years_experience int,
  stats_awards int,
  updated_at timestamptz not null default now()
);

insert into settings (id) values (1);

-- ------------------------------------------------------------
-- CONTACT INQUIRIES
-- ------------------------------------------------------------
create table contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  project_type text,
  status text not null default 'new', -- new | read | replied | archived
  created_at timestamptz not null default now()
);

create index contacts_status_idx on contacts (status, created_at desc);

-- ============================================================
-- updated_at triggers
-- ============================================================
create function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_set_updated_at before update on projects
  for each row execute procedure public.set_updated_at();
create trigger blogs_set_updated_at before update on blogs
  for each row execute procedure public.set_updated_at();
create trigger settings_set_updated_at before update on settings
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table profiles enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table project_videos enable row level security;
alter table services enable row level security;
alter table testimonials enable row level security;
alter table blogs enable row level security;
alter table team enable row level security;
alter table client_logos enable row level security;
alter table settings enable row level security;
alter table contacts enable row level security;

-- profiles: a user can read their own profile; admins can read all
create policy "read own profile" on profiles for select
  using (id = auth.uid() or public.is_admin());
create policy "admins manage profiles" on profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- projects: public can read published; staff can read all; only staff can write
create policy "public read published projects" on projects for select
  using (published = true or public.is_staff());
create policy "staff write projects" on projects for insert
  with check (public.is_staff());
create policy "staff update projects" on projects for update
  using (public.is_staff()) with check (public.is_staff());
create policy "admins delete projects" on projects for delete
  using (public.is_admin());

-- project_images / project_videos follow the parent project's visibility
create policy "public read project images" on project_images for select
  using (
    public.is_staff() or exists (
      select 1 from projects p where p.id = project_id and p.published = true
    )
  );
create policy "staff write project images" on project_images for all
  using (public.is_staff()) with check (public.is_staff());

create policy "public read project videos" on project_videos for select
  using (
    public.is_staff() or exists (
      select 1 from projects p where p.id = project_id and p.published = true
    )
  );
create policy "staff write project videos" on project_videos for all
  using (public.is_staff()) with check (public.is_staff());

-- services, testimonials, team, client_logos: public read, staff write
create policy "public read services" on services for select using (true);
create policy "staff write services" on services for all
  using (public.is_staff()) with check (public.is_staff());

create policy "public read testimonials" on testimonials for select
  using (published = true or public.is_staff());
create policy "staff write testimonials" on testimonials for all
  using (public.is_staff()) with check (public.is_staff());

create policy "public read team" on team for select
  using (published = true or public.is_staff());
create policy "staff write team" on team for all
  using (public.is_staff()) with check (public.is_staff());

create policy "public read logos" on client_logos for select using (true);
create policy "staff write logos" on client_logos for all
  using (public.is_staff()) with check (public.is_staff());

-- blogs: public read published, staff read/write all
create policy "public read published blogs" on blogs for select
  using (published = true or public.is_staff());
create policy "staff write blogs" on blogs for all
  using (public.is_staff()) with check (public.is_staff());

-- settings: public read, only admins write
create policy "public read settings" on settings for select using (true);
create policy "admins update settings" on settings for update
  using (public.is_admin()) with check (public.is_admin());

-- contacts: anyone can insert (the contact form), only staff can read/manage
create policy "anyone can submit a contact" on contacts for insert
  with check (true);
create policy "staff read contacts" on contacts for select
  using (public.is_staff());
create policy "staff update contacts" on contacts for update
  using (public.is_staff()) with check (public.is_staff());
create policy "admins delete contacts" on contacts for delete
  using (public.is_admin());
