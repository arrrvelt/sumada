-- Sumada database schema
-- Run in this order: a table must exist before another can reference it.

create table events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  room_code text unique not null,
  created_at timestamptz not null default now()
);

create table criteria (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null,
  weight numeric not null,
  max numeric not null
);

create table contestants (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null
);

create table judges (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  name text not null
);

create table scores (
  id uuid primary key default gen_random_uuid(),
  judge_id uuid not null references judges(id) on delete cascade,
  contestant_id uuid not null references contestants(id) on delete cascade,
  criterion_id uuid not null references criteria(id) on delete cascade,
  score numeric not null,
  unique (judge_id, contestant_id, criterion_id)
);