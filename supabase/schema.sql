-- Optional migration for the future Supabase adapter. The demo uses localStorage.
create table if not exists public.slots (
  id bigint generated always as identity primary key,
  slot_number smallint not null unique check (slot_number between 1 and 3),
  status text not null default 'FREE' check (status in ('FREE', 'OCCUPIED')),
  plate_number text,
  entry_time timestamptz,
  constraint slot_state_consistent check (
    (status = 'FREE' and plate_number is null and entry_time is null) or
    (status = 'OCCUPIED' and plate_number is not null and entry_time is not null)
  )
);

create table if not exists public.logs (
  id uuid primary key default gen_random_uuid(),
  slot_number smallint not null check (slot_number between 1 and 3),
  plate_number text not null,
  action text not null check (action in ('ENTRY', 'EXIT')),
  time timestamptz not null default now()
);

create index if not exists logs_time_desc_idx on public.logs (time desc);

insert into public.slots (slot_number) values (1), (2), (3)
on conflict (slot_number) do nothing;

alter table public.slots enable row level security;
alter table public.logs enable row level security;

-- When migrating, replace the demo credentials with Supabase Auth and restrict
-- these policies to your admin role. Keep writes in one server-side transaction.
