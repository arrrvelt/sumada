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

alter table events
  add column owner_id uuid not null default auth.uid() references auth.users(id);

create policy "Organizers manage their own events"
on events
for all
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Organizers manage criteria of their events"
on criteria
for all
to authenticated
using (
  exists (
    select 1 from events
    where events.id = criteria.event_id
      and events.owner_id = auth.uid()
  )
)
with check ( 
  exists (
    select 1 from events
    where events.id = criteria.event_id
      and events.owner_id = auth.uid()
  )
);

create policy "Organizers manage contestants of their events"
on contestants
for all
to authenticated
using (
  exists (
    select 1 from events
    where events.id = contestants.event_id
      and events.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from events
    where events.id = contestants.event_id
      and events.owner_id = auth.uid()
  )
);

create policy "Organizers manage judges of their events"
on judges
for all
to authenticated
using (
  exists (
    select 1 from events
    where events.id = judges.event_id
      and events.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from events
    where events.id = judges.event_id
      and events.owner_id = auth.uid()
  )
);

create policy "Organizers manage scores of their events"
on scores
for all
to authenticated
using (
  exists (
    select 1 from contestants
    join events on events.id = contestants.event_id
    where contestants.id = scores.contestant_id
      and events.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from contestants
    join events on events.id = contestants.event_id
    where contestants.id = scores.contestant_id
      and events.owner_id = auth.uid()
  )
);