-- Supabase → SQL Editor → Run (buckets + políticas RLS).
-- cars-images: fotos JPG (200 KB). Facturas: PDF (10 MB).
-- Misma ruta relativa en ambos: {marca y modelo}/{n}.jpg | {marca y modelo}/{n}.pdf

insert into storage.buckets (id, name, public, file_size_limit)
values ('cars-images', 'cars-images', true, 204800)
on conflict (id) do update set
  public = true,
  file_size_limit = 204800;

insert into storage.buckets (id, name, public, file_size_limit)
values ('Facturas', 'Facturas', true, 10485760)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760;

drop policy if exists "cars-images lectura publica" on storage.objects;
drop policy if exists "cars-images subida autenticados" on storage.objects;
drop policy if exists "cars-images actualizar autenticados" on storage.objects;
drop policy if exists "cars-images borrar autenticados" on storage.objects;
drop policy if exists "cars-images autenticados all" on storage.objects;

create policy "cars-images lectura publica"
  on storage.objects for select
  to public
  using (bucket_id = 'cars-images');

create policy "cars-images autenticados all"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'cars-images')
  with check (bucket_id = 'cars-images');

drop policy if exists "Facturas lectura publica" on storage.objects;
drop policy if exists "Facturas autenticados all" on storage.objects;

create policy "Facturas lectura publica"
  on storage.objects for select
  to public
  using (bucket_id = 'Facturas');

create policy "Facturas autenticados all"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'Facturas')
  with check (bucket_id = 'Facturas');
