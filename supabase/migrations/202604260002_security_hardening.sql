-- Security hardening migration. Append-only follow-up to 202604260001.
--
-- Scope of this file:
--   1. Retroactive privacy re-blur trigger on species sensitivity changes.
--   2. Photo-path existence check inside create_sighting.
--   3. (NOT IMPLEMENTED) Rolling-window rate limit.
--
-- Note on (3): the existing public.user_action_rate_limits table stores an
-- aggregated counter keyed by (user_id, action, bucket_start) with an
-- action_count column. A rolling window needs a per-event row log so we can
-- count rows in the last interval rather than read a single bucket counter.
-- The brief explicitly says not to silently change the storage shape, so
-- check_user_action_rate_limit is left untouched here. Decision needed
-- before this can land: either (a) add a per-event log table and rewrite
-- the function to count from it, or (b) keep buckets but use sub-hour
-- granularity (e.g. 5-minute buckets summed over the last 12 buckets).
-- Asking before changing.
--
-- Note on naming: the brief refers to "location_privacy_level" on the
-- species table, but that column lives on public.sightings. The species
-- table's equivalent column is sensitivity_level, which is the source the
-- original create_sighting reads when stamping a sighting's
-- location_privacy_level. The trigger below watches sensitivity_level.

-- ---------------------------------------------------------------------------
-- 1. Retroactive privacy via trigger on species sensitivity changes
-- ---------------------------------------------------------------------------

-- Mirrors the precision logic from create_sighting in 202604260001 lines
-- 235-247. Kept in lockstep manually; if that case expression changes,
-- update this function too.
--
-- When the new sensitivity_level is 'restricted', updated rows are dropped
-- from public.public_sightings automatically because that view already
-- filters `location_privacy_level <> 'restricted'` (see 202604260001
-- lines 310-325). We deliberately do not duplicate that filter here.
--
-- status is intentionally not touched: privacy and moderation are
-- independent axes. A previously approved sighting stays approved at the
-- new precision; a pending one stays pending.

create or replace function public.species_reblur_sightings()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_sighting record;
  v_precision_m integer;
  v_blurred record;
begin
  for v_sighting in
    select s.id, spl.latitude, spl.longitude
    from public.sightings s
    join public.sighting_private_locations spl
      on spl.sighting_id = s.id
    where s.species_id = NEW.id
  loop
    v_precision_m :=
      case
        when NEW.sensitivity_level = 'restricted'
          then greatest(NEW.public_precision_m, 50000)
        when NEW.sensitivity_level = 'sensitive'
          or NEW.conservation_status in (
            'vulnerable',
            'endangered',
            'critically_endangered',
            'extinct_in_wild'
          )
          then greatest(NEW.public_precision_m, 10000)
        else greatest(NEW.public_precision_m, 1000)
      end;

    select * into v_blurred
    from public.blur_coordinate(
      v_sighting.latitude,
      v_sighting.longitude,
      v_precision_m
    );

    update public.sightings
    set
      blurred_latitude = v_blurred.blurred_latitude,
      blurred_longitude = v_blurred.blurred_longitude,
      public_accuracy_m = v_precision_m,
      location_privacy_level = NEW.sensitivity_level
    where id = v_sighting.id;
  end loop;

  return NEW;
end;
$$;

drop trigger if exists species_privacy_change_reblur on public.species;
create trigger species_privacy_change_reblur
after update of sensitivity_level on public.species
for each row
when (OLD.sensitivity_level is distinct from NEW.sensitivity_level)
execute function public.species_reblur_sightings();

-- ---------------------------------------------------------------------------
-- 2. Photo path existence check in create_sighting
-- ---------------------------------------------------------------------------
--
-- Replaces 202604260001's create_sighting. The only behavioural change is
-- a new existence check against storage.objects immediately after the
-- existing photo_path regex check. Everything else (parameter list,
-- return type, ordering of checks, validation messages, insert columns)
-- is byte-identical to the original.

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

  if p_photo_path is not null then
    if not exists (
      select 1
      from storage.objects
      where bucket_id = 'sighting-photos'
        and name = p_photo_path
    ) then
      raise exception 'Photo not found in storage';
    end if;
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
