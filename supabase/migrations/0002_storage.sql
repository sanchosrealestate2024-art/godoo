-- ============================================================
-- STORAGE BUCKETS
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-images', 'project-images', true, 20971520, array['image/jpeg','image/png','image/webp','image/avif']),
  ('project-videos', 'project-videos', true, 524288000, array['video/mp4','video/webm','video/quicktime']),
  ('team', 'team', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('blog', 'blog', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('logos', 'logos', true, 5242880, array['image/png','image/svg+xml','image/webp']),
  ('documents', 'documents', false, 52428800, null)
on conflict (id) do nothing;

-- Public read for public buckets
create policy "public read project-images" on storage.objects for select
  using (bucket_id = 'project-images');
create policy "public read project-videos" on storage.objects for select
  using (bucket_id = 'project-videos');
create policy "public read team" on storage.objects for select
  using (bucket_id = 'team');
create policy "public read blog" on storage.objects for select
  using (bucket_id = 'blog');
create policy "public read logos" on storage.objects for select
  using (bucket_id = 'logos');

-- documents bucket: staff only
create policy "staff read documents" on storage.objects for select
  using (bucket_id = 'documents' and public.is_staff());

-- Writes: only authenticated staff, for every bucket
create policy "staff upload files" on storage.objects for insert
  with check (
    bucket_id in ('project-images','project-videos','team','blog','logos','documents')
    and public.is_staff()
  );
create policy "staff update files" on storage.objects for update
  using (
    bucket_id in ('project-images','project-videos','team','blog','logos','documents')
    and public.is_staff()
  );
create policy "staff delete files" on storage.objects for delete
  using (
    bucket_id in ('project-images','project-videos','team','blog','logos','documents')
    and public.is_admin()
  );
