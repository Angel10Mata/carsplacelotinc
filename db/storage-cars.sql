-- Supabase → SQL Editor → Run (bucket cars-images + políticas RLS).
-- Sin políticas: "new row violates row-level security policy".
-- Sin file_size_limit 5 MB: "maximum allowed size" al subir fotos comprimidas.

insert into storage.buckets (id, name, public, file_size_limit)
values ('cars-images', 'cars-images', true, 5242880)
on conflict (id) do update set
  public = true,
  file_size_limit = 5242880;

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
