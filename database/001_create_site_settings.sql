-- Creates a simple key/value table for site-wide settings
create table if not exists public.site_settings (
  key text primary key,
  value boolean default false,
  updated_at timestamptz default now()
);

-- default row
insert into public.site_settings (key, value) values ('maintenance', false)
on conflict (key) do nothing;