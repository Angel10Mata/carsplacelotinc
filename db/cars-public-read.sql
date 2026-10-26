-- Lectura pública del catálogo (rol anon) — ejecutar en Supabase SQL Editor.
-- Las fotos ya son públicas vía storage-cars.sql; esto expone filas de cars sin login.

drop policy if exists "Lectura publica catalogo cars" on public.cars;

create policy "Lectura publica catalogo cars"
  on public.cars
  for select
  to anon, authenticated
  using (true);
