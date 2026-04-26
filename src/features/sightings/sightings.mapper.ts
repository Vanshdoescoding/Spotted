import { z } from "zod";

import { conservationStatuses, sensitivityLevels } from "../../security/sightingPrivacy";
import { getPublicLocationLabel } from "../safety/wildlifeSafety";
import type { Species } from "../species/species.types";
import type { PublicSighting, SightingVerificationStatus } from "./sightings.types";

const verificationSchema = z
  .enum(["pending", "community_checked", "verified", "rejected"])
  .catch("pending");

const raritySchema = z.enum(["common", "uncommon", "rare", "legendary"]).catch("common");

export const publicSightingRowSchema = z
  .object({
    id: z.string(),
    species_id: z.string(),
    observed_at: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    accuracy_m: z.number().int().positive().nullable().optional(),
    location_privacy_level: z.enum(sensitivityLevels).nullable().optional(),
    status: z.string().nullable().optional(),
    note: z.string().nullable().optional(),
    created_at: z.string().nullable().optional(),
    species_common_name: z.string().nullable().optional(),
    species_scientific_name: z.string().nullable().optional(),
    species_image_url: z.string().url().nullable().optional(),
    conservation_status: z.enum(conservationStatuses).nullable().optional(),
    rarity_tier: raritySchema.nullable().optional(),
  })
  .passthrough();

export type PublicSightingRow = z.infer<typeof publicSightingRowSchema>;

export function mapPublicSightingRowToPublicSighting(
  row: unknown,
  species?: Species,
): PublicSighting {
  const parsed = publicSightingRowSchema.parse(row);
  const conservationStatus =
    parsed.conservation_status ?? species?.conservationStatus ?? "least_concern";
  const locationPrivacyLevel = parsed.location_privacy_level ?? "public";
  const speciesScientificName = parsed.species_scientific_name ?? species?.scientificName;
  const rarityTier = parsed.rarity_tier ?? species?.rarity;

  const publicLocationProfile =
    parsed.accuracy_m === null || parsed.accuracy_m === undefined
      ? { sensitivityLevel: locationPrivacyLevel, conservationStatus }
      : {
          sensitivityLevel: locationPrivacyLevel,
          conservationStatus,
          publicPrecisionMeters: parsed.accuracy_m,
        };

  return {
    id: parsed.id,
    speciesId: parsed.species_id,
    speciesCommonName:
      parsed.species_common_name ?? species?.commonName ?? "Unknown species",
    conservationStatus,
    observedAt: parsed.observed_at,
    latitudePublic: parsed.latitude,
    longitudePublic: parsed.longitude,
    publicLocationLabel: getPublicLocationLabel(publicLocationProfile),
    publicAccuracyMeters: parsed.accuracy_m ?? 1000,
    locationPrivacyLevel,
    verificationStatus: mapVerificationStatus(parsed.status),
    ...(speciesScientificName ? { speciesScientificName } : {}),
    ...(parsed.species_image_url ? { speciesImageUrl: parsed.species_image_url } : {}),
    ...(rarityTier ? { rarityTier } : {}),
    ...(parsed.note ? { note: parsed.note } : {}),
    ...(parsed.created_at ? { createdAt: parsed.created_at } : {}),
  };
}

function mapVerificationStatus(status: string | null | undefined): SightingVerificationStatus {
  if (status === "approved") {
    return "verified";
  }

  return verificationSchema.parse(status ?? "pending");
}
