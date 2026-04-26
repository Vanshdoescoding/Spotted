# Supabase Integration

Spotted uses Supabase for auth, database, storage, and future server-side functions. This repository currently enables read-only public data paths and keeps sighting creation blocked.

## Environment

```sh
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_USE_MOCK_DATA=true
```

Set `EXPO_PUBLIC_USE_MOCK_DATA=false` only when the Supabase project has the security migration applied.

## Required Migration

Apply `supabase/migrations/202604260001_security_foundation.sql`.

The app expects:

- `public.species`: public species metadata.
- `public.public_sightings`: approved public sightings with blurred coordinates.
- `public.create_sighting`: future secure sighting creation RPC.

## Service Mapping

- `src/features/species/species.repository.ts` reads `public.species`.
- `src/features/sightings/sightings.repository.ts` reads `public.public_sightings`.
- UI screens call React Query hooks, not Supabase directly.
- Auth uses `src/features/auth` and does not block public browsing.

## Sighting Writes

Direct writes to `public.sightings` are forbidden. Future sighting creation must call `create_sighting`, which owns:

- authenticated reporter identity
- server-side validation
- private coordinate storage
- public coordinate blurring
- sensitive species protection
- rate limiting foundation

## Mock Fallback

With mock mode enabled, or with missing Supabase env vars, the app uses local mock data. In production, service errors should surface as typed errors and safe empty states rather than silently pretending mock data is live.

## Manual Validation Checklist

- Apply the migration to a local Supabase project.
- Confirm anon/authenticated users can select `public.species`.
- Confirm anon/authenticated users can select `public.public_sightings`.
- Confirm `public.public_sightings` does not expose private coordinates, reporter email, or private photo paths.
- Confirm direct client inserts into `public.sightings` fail.
- Confirm authenticated `create_sighting` stores exact coordinates only in `sighting_private_locations`.
- Confirm restricted sightings are not returned by `public.public_sightings`.

