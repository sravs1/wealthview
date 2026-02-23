-- ============================================================
-- Wealthview — Initial database schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- ── Profiles ─────────────────────────────────────────────────
-- Extends auth.users with app-specific data
create table if not exists public.profiles (
  id                      uuid        not null references auth.users on delete cascade,
  email                   text,
  full_name               text,
  avatar_url              text,
  subscription_tier       text        not null default 'free'
                            check (subscription_tier in ('free','pro','enterprise')),
  stripe_customer_id      text        unique,
  stripe_subscription_id  text        unique,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  primary key (id)
);

-- Row Level Security
alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile after sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();


-- ── Connected Exchanges ───────────────────────────────────────
create table if not exists public.connected_exchanges (
  id                  uuid        not null default gen_random_uuid(),
  user_id             uuid        not null references auth.users on delete cascade,
  exchange_slug       text        not null,
  exchange_name       text        not null,
  connection_type     text        not null default 'api_key'
                        check (connection_type in ('api_key','oauth')),
  api_key             text,
  api_secret          text,
  api_passphrase      text,
  access_token        text,
  refresh_token       text,
  is_active           boolean     not null default true,
  last_synced_at      timestamptz,
  created_at          timestamptz not null default now(),
  primary key (id),
  unique (user_id, exchange_slug)
);

-- Row Level Security — users only see/manage their own rows
alter table public.connected_exchanges enable row level security;

create policy "Users can manage their own exchanges"
  on public.connected_exchanges for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ── Portfolio Snapshots (for historical charts) ───────────────
create table if not exists public.portfolio_snapshots (
  id              uuid        not null default gen_random_uuid(),
  user_id         uuid        not null references auth.users on delete cascade,
  exchange_slug   text,
  total_value_usd numeric(20, 8),
  assets          jsonb,
  snapshot_at     timestamptz not null default now(),
  primary key (id)
);

alter table public.portfolio_snapshots enable row level security;

create policy "Users can read their own snapshots"
  on public.portfolio_snapshots for select
  using (auth.uid() = user_id);

create policy "Users can insert their own snapshots"
  on public.portfolio_snapshots for insert
  with check (auth.uid() = user_id);
