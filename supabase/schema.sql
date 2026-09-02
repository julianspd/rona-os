-- ============================================================
-- Rona OS — schema
--
-- Paste this into the Supabase SQL editor and run it once.
-- Safe to re-run: everything is IF NOT EXISTS or CREATE OR REPLACE.
--
-- One `cards` table rather than fifteen. The card union has sixteen
-- kinds with very different shapes; normalising them buys nothing at
-- this scale and costs weeks. A kind column plus jsonb mirrors the
-- entity consolidation the product already uses.
--
-- Row Level Security everywhere. It costs nothing now and is what
-- makes a multi-tenant version possible later, which matters because
-- selling this is the stated two-year goal.
-- ============================================================

-- ---- Cards --------------------------------------------------
create table if not exists public.cards (
  id          text        not null,
  user_id     uuid        not null references auth.users on delete cascade,
  kind        text        not null,
  title       text        not null default '',
  -- Everything kind-specific. The app's card shapes are the contract.
  data        jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (user_id, id)
);

-- Reads are almost always "everything of one kind for one person".
create index if not exists cards_user_kind_idx on public.cards (user_id, kind);
create index if not exists cards_updated_idx   on public.cards (user_id, updated_at desc);

-- ---- Preferences --------------------------------------------
create table if not exists public.prefs (
  user_id       uuid primary key references auth.users on delete cascade,
  top3          text[]      not null default '{}',
  show_amounts  boolean     not null default true,
  updated_at    timestamptz not null default now()
);

-- ---- Weekly reviews -----------------------------------------
-- Kept as its own table rather than a card: a review is a record of a
-- moment, not something that later gets edited or completed.
create table if not exists public.reviews (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users on delete cascade,
  closed_on   text        not null,
  closed_iso  date        not null,
  payload     jsonb       not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index if not exists reviews_user_idx on public.reviews (user_id, closed_iso desc);

-- ---- Decision answers ---------------------------------------
create table if not exists public.answers (
  user_id      uuid        not null references auth.users on delete cascade,
  decision_id  text        not null,
  answer       text        not null default '',
  updated_at   timestamptz not null default now(),
  primary key (user_id, decision_id)
);

-- ============================================================
-- Row Level Security
--
-- Nobody reads or writes a row that is not theirs, enforced by the
-- database rather than by the application remembering to filter.
-- ============================================================

alter table public.cards   enable row level security;
alter table public.prefs   enable row level security;
alter table public.reviews enable row level security;
alter table public.answers enable row level security;

do $$
declare t text;
begin
  foreach t in array array['cards', 'prefs', 'reviews', 'answers'] loop
    execute format('drop policy if exists own_rows on public.%I', t);
    execute format($f$
      create policy own_rows on public.%I
        for all
        using (user_id = auth.uid())
        with check (user_id = auth.uid())
    $f$, t);
  end loop;
end $$;

-- ---- Keep updated_at honest ---------------------------------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists cards_touch on public.cards;
create trigger cards_touch before update on public.cards
  for each row execute function public.touch_updated_at();

drop trigger if exists prefs_touch on public.prefs;
create trigger prefs_touch before update on public.prefs
  for each row execute function public.touch_updated_at();

drop trigger if exists answers_touch on public.answers;
create trigger answers_touch before update on public.answers
  for each row execute function public.touch_updated_at();
