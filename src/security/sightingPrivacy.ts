import { z } from "zod";

export const PUBLIC_SPECIES_PRECISION_METERS = 1000;
export const SENSITIVE_SPECIES_PRECISION_METERS = 10000;
export const RESTRICTED_SPECIES_PRECISION_METERS = 50000;
export const MAX_NOTE_LENGTH = 500;

export const coordinateLeakPattern =
  /[-+]?\d{1,2}\.\d{4,}\s*[, ]\s*[-+]?\d{1,3}\.\d{4,}/;

export const sensitivityLevels = ["public", "sensitive", "restricted"] as const;
export type SensitivityLevel = (typeof sensitivityLevels)[number];

export const conservationStatuses = [
  "not_evaluated",
  "least_concern",
  "near_threatened",
  "vulnerable",
  "endangered",
  "critically_endangered",
  "extinct_in_wild",
] as const;
export type ConservationStatus = (typeof conservationStatuses)[number];

const latitudeSchema = z.number().finite().min(-90).max(90);
const longitudeSchema = z.number().finite().min(-180).max(180);

export const sightingSubmissionSchema = z
  .object({
    speciesId: z.uuid(),
    observedAt: z.coerce.date(),
    latitude: latitudeSchema,
    longitude: longitudeSchema,
    accuracyMeters: z.number().int().positive().max(50000).optional(),
    note: z.string().trim().max(MAX_NOTE_LENGTH).optional(),
    photoPath: z
      .string()
      .trim()
      .regex(/^[a-zA-Z0-9/_-]+\.(jpe?g|png|webp|heic|heif)$/i)
      .optional(),
  })
  .superRefine((value, context) => {
    if (value.observedAt.getTime() > Date.now() + 10 * 60 * 1000) {
      context.addIssue({
        code: "custom",
        path: ["observedAt"],
        message: "Observation time cannot be in the future.",
      });
    }

    if (value.note && coordinateLeakPattern.test(value.note)) {
      context.addIssue({
        code: "custom",
        path: ["note"],
        message: "Notes must not include exact coordinates.",
      });
    }
  });

export type SightingSubmission = z.infer<typeof sightingSubmissionSchema>;

export interface SpeciesPrivacyProfile {
  sensitivityLevel: SensitivityLevel;
  conservationStatus: ConservationStatus;
  publicPrecisionMeters?: number;
}

export interface PublicCoordinate {
  latitude: number;
  longitude: number;
  accuracyMeters: number;
}

export function containsCoordinateLeak(text: string): boolean {
  return coordinateLeakPattern.test(text);
}

export function isSensitiveSpecies(profile: SpeciesPrivacyProfile): boolean {
  return (
    profile.sensitivityLevel !== "public" ||
    profile.conservationStatus === "vulnerable" ||
    profile.conservationStatus === "endangered" ||
    profile.conservationStatus === "critically_endangered" ||
    profile.conservationStatus === "extinct_in_wild"
  );
}

export function getPublicPrecisionMeters(profile: SpeciesPrivacyProfile): number {
  if (profile.sensitivityLevel === "restricted") {
    return Math.max(
      profile.publicPrecisionMeters ?? 0,
      RESTRICTED_SPECIES_PRECISION_METERS,
    );
  }

  if (isSensitiveSpecies(profile)) {
    return Math.max(
      profile.publicPrecisionMeters ?? 0,
      SENSITIVE_SPECIES_PRECISION_METERS,
    );
  }

  return Math.max(profile.publicPrecisionMeters ?? 0, PUBLIC_SPECIES_PRECISION_METERS);
}

export function blurCoordinate(
  latitude: number,
  longitude: number,
  precisionMeters: number,
): PublicCoordinate {
  const latGrid = precisionMeters / 111_320;
  const cosLatitude = Math.max(Math.cos((latitude * Math.PI) / 180), 0.01);
  const lonGrid = precisionMeters / (111_320 * cosLatitude);

  return {
    latitude: roundToGrid(latitude, latGrid),
    longitude: roundToGrid(longitude, lonGrid),
    accuracyMeters: precisionMeters,
  };
}

export function getPublicCoordinate(
  latitude: number,
  longitude: number,
  profile: SpeciesPrivacyProfile,
): PublicCoordinate {
  return blurCoordinate(latitude, longitude, getPublicPrecisionMeters(profile));
}

function roundToGrid(value: number, gridSize: number): number {
  return Number((Math.round(value / gridSize) * gridSize).toFixed(6));
}

