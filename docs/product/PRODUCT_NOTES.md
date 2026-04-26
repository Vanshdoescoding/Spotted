# Product Notes

## Core User Loop

1. Notice wildlife nearby.
2. Record a sighting with a photo, selected image, or careful written observation.
3. The app protects sensitive locations before public display.
4. Sightings help build a personal species collection.
5. Verified community sightings make the nearby map more useful.

## MVP Scope

- iOS-first Expo shell.
- Bottom tab navigation.
- Public-safe sightings map placeholder.
- First-step sighting flow with permission education.
- Mock collection and species detail foundations.
- Privacy and safety messaging throughout the UI.
- Read-only Supabase service boundaries for species and public sightings.
- Auth foundation that does not block public browsing.

## Intentionally Not Built Yet

- Production authentication flows.
- Real sighting submission.
- AI identification.
- Push notifications.
- Leaderboards.
- Moderation queue UI.
- Production photo processing.

## Iteration 2 Status

Real read-only service paths now exist for species and approved public sightings when Supabase env vars are configured and mock mode is disabled. Collection, profile metrics, map rendering, photo handling, and sighting submission remain mocked or blocked.

Sighting creation remains blocked because public safety depends on the `create_sighting` RPC, private coordinate separation, validation, rate limiting, and future photo metadata handling being wired end to end.

## Future Iterations

- Validate Supabase reads against a local project and add RLS integration tests.
- Wire production auth screens and account lifecycle requirements.
- Implement sighting creation through the secure RPC.
- Add EXIF stripping and image moderation.
- Build species data import and sensitivity rules.
- Add account deletion, export, reporting, blocking, and moderation flows.
