# Spotted

Spotted is an iOS-first wildlife discovery app foundation. It combines a careful community sightings layer with a mature collection layer for real species cards.

This repo is an early technical foundation, not an App Store-ready product.

## Current Status

- Expo Router app shell with Home, Map, Add, Collection, Profile, Species Detail, Sighting Detail, Settings, and Permissions routes.
- Read-only Supabase service paths for species and public sightings, with mock fallback.
- Sighting writes, photo uploads, and production auth flows are not wired yet.
- Security foundation exists in `docs/security` and `supabase/migrations`.

## Setup

```sh
npm install
npm run start
```

For iOS development:

```sh
npm run ios
```

## Scripts

- `npm run start`: start Expo.
- `npm run ios`: start Expo for iOS.
- `npm run typecheck`: run TypeScript.
- `npm test`: run Vitest.
- `npm run lint`: run ESLint.

## Environment

Copy `.env.example` and set:

```sh
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_USE_MOCK_DATA=true
```

Only publishable Expo environment variables belong in the mobile app. Service-role keys and other secrets must stay server-side.

`EXPO_PUBLIC_USE_MOCK_DATA=true` keeps the app on local mock data. Set it to `false` with valid Supabase public env vars to enable read-only species and public sighting reads.

## Supabase Reads

The app expects the security migration in `supabase/migrations` to be applied. Current read services use:

- `public.species` for public species metadata.
- `public.public_sightings` for approved sightings with blurred public coordinates.

If Supabase is not configured, local development safely falls back to mock species, sightings, collection, and profile data. Sighting creation is intentionally blocked in this iteration.

## Security Note

Exact wildlife locations and user locations are sensitive. Real sighting submission must go through the secure `create_sighting` RPC from the Supabase migration. The mobile app must not write directly to `public.sightings` or expose private coordinates in UI models.
