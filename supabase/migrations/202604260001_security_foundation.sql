create extension if not exists pgcrypto;

create table if not exists public.species (
  id uuid primary key default gen_random_uuid(),
  scientific_name text not null,
  common_name text not null,
  conservation_status text not null default 'not_evaluated'
    check (
      conservation_status in (
        'not_evaluated',
        'least_concern',
        'near_threatened',
        'vulnerable',
        'endangered',
        'critically_endangered',
        'extinct_in_wild'
      )
    ),
  sensitivity_level text not null default 'public'
    check (sensitivity_level in ('public', 'sensitive', 'restricted')),
  public_precision_m integer not null default 1000 check (public_precision_m >= 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.sightings (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  species_id uuid not null references public.species(id),
  observed_at timestamptz not null,
  note text,
  blurred_latitude double precision not null check (blurred_latitude between -90 and 90),
  blurred_longitude double precision not null check (blurred_longitude between -180 and 180),
  public_accuracy_m integer not null check (public_accuracy_m >= 1000),
  location_privacy_level text not null check (location_privacy_level in ('public', 'sensitive', 'restricted')),
  photo_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sighting_note_length check (note is null or char_length(note) <= 500),
  constraint sighting_observed_at_not_future check (observed_at <= now() + interval '10 minutes')
);

create table if not exists public.sighting_private_locations (
  sighting_id uuid primary key references public.sightings(id) on delete cascade,
  reporter_id uuid not null references auth.users(id) on delete cascade,
  latitude double precision not null check (latitude between -90 and 90),
  longitude double precision not null check (longitude between -180 and 180),
  accuracy_m integer check (accuracy_m is null or accuracy_m between 1 and 50000),
  created_at timestamptz not null default now()
);

create table if not exists public.sighting_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  sighting_id uuid not null references public.sightings(id) on delete cascade,
  reason text not null check (
    reason in (
      'unsafe_location',
      'fake_sighting',
      'harmful_content',
      'spam',
      'privacy',
      'other'
    )
  ),
  details text check (details is null or char_length(details) <= 500),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (reporter_id, sighting_id, reason)
);

create table if not exists public.user_action_rate_limits (
  user_id uuid not null references auth.users(id) on delete cascade,
  action text not null,
  bucket_start timestamptz not null,
  action_count integer not null default 0 check (action_count >= 0),
  primary key (user_id, action, bucket_start)
);

alter table public.species enable row level security;
alter table public.sightings enable row level security;
alter table public.sighting_private_locations enable row level security;
alter table public.sighting_reports enable row level security;
alter table public.user_action_rate_limits enable row level security;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sightings_set_updated_at on public.sightings;
create trigger sightings_set_updated_at
before update on public.sightings
for each row execute function public.set_updated_at();

create or replace function public.note_contains_exact_coordinate(value text)
returns boolean
language sql
immutable
as $$
  select coalesce(value ~ '[-+]?[0-9]{1,2}\.[0-9]{4,}[[:space:],]+[-+]?[0-9]{1,3}\.[0-9]{4,}', false);
$$;

create or replace function public.blur_coordinate(
  p_latitude double precision,
  p_longitude double precision,
  precision_m integer
)
returns table(blurred_latitude double precision, blurred_longitude double precision)
language plpgsql
immutable
as $$
declare
  lat_grid double precision;
  lon_grid double precision;
  cos_lat double precision;
begin
  lat_grid := precision_m::double precision / 111320.0;
  cos_lat := greatest(cos(radians(p_latitude)), 0.01);
  lon_grid := precision_m::double precision / (111320.0 * cos_lat);

  return query
  select
    round((p_latitude / lat_grid)::numeric)::double precision * lat_grid,
    round((p_longitude / lon_grid)::numeric)::double precision * lon_grid;
end;
$$;

create or replace function public.check_user_action_rate_limit(
  p_user_id uuid,
  p_action text,
  p_limit integer,
  p_window interval default interval '1 hour'
)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_bucket timestamptz;
  v_count integer;
begin
  if p_window <> interval '1 hour' then
    raise exception 'Unsupported rate limit window';
  end if;

  v_bucket := date_trunc('hour', now());

  insert into public.user_action_rate_limits (user_id, action, bucket_start, action_count)
  values (p_user_id, p_action, v_bucket, 1)
  on conflict (user_id, action, bucket_start)
  do update set action_count = public.user_action_rate_limits.action_count + 1
  returning action_count into v_count;

  if v_count > p_limit then
    raise exception 'Rate limit exceeded for action %', p_action;
  end if;
end;
$$;

create or replace function public.create_sighting(
  p_species_id uuid,
  p_observed_at timestamptz,
  p_latitude double precision,
  p_longitude double precision,
  p_accuracy_m integer default null,
  p_note text default null,
  p_photo_path text default null
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_user_id uuid;
  v_species public.species%rowtype;
  v_precision_m integer;
  v_blurred record;
  v_sighting_id uuid;
  v_note text;
begin
  v_user_id := auth.uid();

  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  if p_latitude is null or p_latitude < -90 or p_latitude > 90 then
    raise exception 'Invalid latitude';
  end if;

  if p_longitude is null or p_longitude < -180 or p_longitude > 180 then
    raise exception 'Invalid longitude';
  end if;

  if p_accuracy_m is not null and (p_accuracy_m < 1 or p_accuracy_m > 50000) then
    raise exception 'Invalid location accuracy';
  end if;

  if p_observed_at is null or p_observed_at > now() + interval '10 minutes' then
    raise exception 'Invalid observation time';
  end if;

  v_note := nullif(trim(p_note), '');

  if v_note is not null and char_length(v_note) > 500 then
    raise exception 'Sighting note is too long';
  end if;

  if public.note_contains_exact_coordinate(v_note) then
    raise exception 'Sighting notes must not include exact coordinates';
  end if;

  if p_photo_path is not null and p_photo_path !~ (
    '^' || v_user_id::text || '/[a-zA-Z0-9/_-]+\.(jpe?g|png|webp|heic|heif)$'
  ) then
    raise exception 'Invalid photo path';
  end if;

  select * into v_species
  from public.species
  where id = p_species_id;

  if not found then
    raise exception 'Unknown species';
  end if;

  v_precision_m :=
    case
      when v_species.sensitivity_level = 'restricted' then greatest(v_species.public_precision_m, 50000)
      when v_species.sensitivity_level = 'sensitive'
        or v_species.conservation_status in (
          'vulnerable',
          'endangered',
          'critically_endangered',
          'extinct_in_wild'
        )
        then greatest(v_species.public_precision_m, 10000)
      else greatest(v_species.public_precision_m, 1000)
    end;

  select * into v_blurred
  from public.blur_coordinate(p_latitude, p_longitude, v_precision_m);

  perform public.check_user_action_rate_limit(v_user_id, 'create_sighting', 20);

  insert into public.sightings (
    reporter_id,
    species_id,
    observed_at,
    note,
    blurred_latitude,
    blurred_longitude,
    public_accuracy_m,
    location_privacy_level,
    photo_path,
    status
  )
  values (
    v_user_id,
    p_species_id,
    p_observed_at,
    v_note,
    v_blurred.blurred_latitude,
    v_blurred.blurred_longitude,
    v_precision_m,
    v_species.sensitivity_level,
    p_photo_path,
    'pending'
  )
  returning id into v_sighting_id;

  insert into public.sighting_private_locations (
    sighting_id,
    reporter_id,
    latitude,
    longitude,
    accuracy_m
  )
  values (
    v_sighting_id,
    v_user_id,
    p_latitude,
    p_longitude,
    p_accuracy_m
  );

  return v_sighting_id;
end;
$$;

revoke all on public.species from anon, authenticated;
revoke all on public.sightings from anon, authenticated;
revoke all on public.sighting_private_locations from anon, authenticated;
revoke all on public.sighting_reports from anon, authenticated;
revoke all on public.user_action_rate_limits from anon, authenticated;

grant select on public.species to anon, authenticated;
grant select on public.sighting_private_locations to authenticated;
grant insert, select on public.sighting_reports to authenticated;
grant execute on function public.create_sighting(uuid, timestamptz, double precision, double precision, integer, text, text) to authenticated;

create or replace view public.public_sightings as
select
  id,
  species_id,
  observed_at,
  note,
  blurred_latitude as latitude,
  blurred_longitude as longitude,
  public_accuracy_m as accuracy_m,
  location_privacy_level,
  status,
  created_at,
  updated_at
from public.sightings
where status = 'approved'
  and location_privacy_level <> 'restricted';

create or replace view public.my_sightings as
select
  id,
  species_id,
  observed_at,
  note,
  blurred_latitude as latitude,
  blurred_longitude as longitude,
  public_accuracy_m as accuracy_m,
  location_privacy_level,
  photo_path,
  status,
  created_at,
  updated_at
from public.sightings
where reporter_id = auth.uid();

grant select on public.public_sightings to anon, authenticated;
grant select on public.my_sightings to authenticated;

create policy "Anyone can read species"
on public.species
for select
to anon, authenticated
using (true);

create policy "Anyone can read approved non-restricted sightings"
on public.sightings
for select
to anon, authenticated
using (status = 'approved' and location_privacy_level <> 'restricted');

create policy "Reporters can read their own sightings"
on public.sightings
for select
to authenticated
using (reporter_id = auth.uid());

create policy "Reporters can read their own private locations"
on public.sighting_private_locations
for select
to authenticated
using (reporter_id = auth.uid());

create policy "Authenticated users can report sightings"
on public.sighting_reports
for insert
to authenticated
with check (reporter_id = auth.uid());

create policy "Reporters can read their own reports"
on public.sighting_reports
for select
to authenticated
using (reporter_id = auth.uid());

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'sighting-photos',
  'sighting-photos',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Users can upload sighting photos to their own folder"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'sighting-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can read their own sighting photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'sighting-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own sighting photos"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'sighting-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);
