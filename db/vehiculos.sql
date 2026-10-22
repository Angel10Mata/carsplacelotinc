-- 1. Tabla de Clientes
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_nit text,
  customer_address text,
  created_at timestamptz not null default now()
);

-- 2. Tabla de cars
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  invoice_number text not null unique,
  invoice_date timestamptz not null,
  has_signed_receipt boolean not null default false,
  customer_id uuid references public.customers(id) on delete restrict,
  car_id text,                                    -- Identificador o carpeta del vehículo
  car_title text not null,
  car_status text,
  car_model text,
  car_vin text,
  car_price numeric(12,2),
  car_images jsonb not null default '[]',         -- Imágenes guardadas en jsonb
  sub_total numeric(12,2) not null,
  total numeric(12,2) not null,
  terms text not null default 'SOLD AS IS, NO WARRANTY',
  incoterms text default 'FOB',
  registered_by text not null,                    -- Nombre del usuario que registra
  created_at timestamptz not null default now()
);

-- Habilitar RLS en ambas tablas
alter table public.customers enable row level security;
alter table public.cars enable row level security;

-- Políticas de acceso
create policy "Acceso total autenticados customers"
  on public.customers for all to authenticated using (true) with check (true);

create policy "Acceso total autenticados cars"
  on public.cars for all to authenticated using (true) with check (true);