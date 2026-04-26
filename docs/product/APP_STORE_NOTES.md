# App Store Notes

Spotted is targeting iOS first. This repository is an early technical foundation and is not App Store ready.

## Expected Permissions

Camera:
Used when the user chooses to capture wildlife evidence for a sighting.

Photo library:
Used when the user chooses an existing image. The app should support limited photo access where possible.

Location:
Used when the user chooses to place a sighting. Public locations must be approximate, and sensitive species locations must be blurred or withheld.

## Privacy Requirements Before Release

- Publish a privacy policy covering location, photos, account data, moderation, and retention.
- Add account deletion and data export.
- Avoid collecting background location unless a future feature has a clear need and explicit consent.
- Strip photo metadata before public display.
- Do not expose exact coordinates for sensitive species.
- If account creation is enabled in beta, account deletion must be available in-app or clearly linked according to Apple guidance.

## User-Generated Content

Spotted will include public sightings, notes, and photos. Before beta, the app needs reporting, moderation review, abuse response, and content removal flows.

Read-only public browsing does not require sign-in. Future authenticated actions should clearly explain why an account is needed.

## App Review Readiness

Permission copy must remain human and specific. The app should request permissions only after user intent, never on launch.
