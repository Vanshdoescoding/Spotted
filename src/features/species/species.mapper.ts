import { z } from "zod";

import { conservationStatuses, sensitivityLevels } from "../../security/sightingPrivacy";
import type { Species, SpeciesRarity } from "./species.types";

const raritySchema = z.enum(["common", "uncommon", "rare", "legendary"]).catch("common");

export const speciesRowSchema = z
  .object({
    id: z.string(),
    common_name: z.string().nullable().optional(),
    commonName: z.string().nullable().optional(),
    scientific_name: z.string().nullable().optional(),
    scientificName: z.string().nullable().optional(),
    conservation_status: z.enum(conservationStatuses).nullable().optional(),
    conservationStatus: z.enum(conservationStatuses).nullable().optional(),
    sensitivity_level: z.enum(sensitivityLevels).nullable().optional(),
    sensitivityLevel: z.enum(sensitivityLevels).nullable().optional(),
    rarity_tier: raritySchema.nullable().optional(),
    rarityTier: raritySchema.nullable().optional(),
    description: z.string().nullable().optional(),
    habitat: z.string().nullable().optional(),
    image_url: z.string().url().nullable().optional(),
    imageUrl: z.string().url().nullable().optional(),
    image_color: z.string().nullable().optional(),
    imageColor: z.string().nullable().optional(),
  })
  .passthrough();

export type SpeciesRow = z.infer<typeof speciesRowSchema>;

export function mapSpeciesRowToSpecies(row: unknown): Species {
  const parsed = speciesRowSchema.parse(row);
  const commonName = parsed.common_name ?? parsed.commonName ?? "Unknown species";
  const scientificName = parsed.scientific_name ?? parsed.scientificName ?? "Scientific name unavailable";
  const conservationStatus =
    parsed.conservation_status ?? parsed.conservationStatus ?? "not_evaluated";
  const sensitivityLevel = parsed.sensitivity_level ?? parsed.sensitivityLevel ?? "public";
  const rarity = normalizeRarity(parsed.rarity_tier ?? parsed.rarityTier, conservationStatus);

  return {
    id: parsed.id,
    commonName,
    scientificName,
    rarity,
    conservationStatus,
    sensitivityLevel,
    description:
      parsed.description ?? "Field guide details are not available for this species yet.",
    habitat: parsed.habitat ?? "Habitat details are not available yet.",
    imageColor: parsed.image_color ?? parsed.imageColor ?? "#8EA57F",
    collected: false,
  };
}

function normalizeRarity(
  rarity: SpeciesRarity | null | undefined,
  conservationStatus: Species["conservationStatus"],
): SpeciesRarity {
  if (rarity) {
    return rarity;
  }

  if (conservationStatus === "endangered" || conservationStatus === "critically_endangered") {
    return "rare";
  }

  if (conservationStatus === "vulnerable" || conservationStatus === "near_threatened") {
    return "uncommon";
  }

  return "common";
}

