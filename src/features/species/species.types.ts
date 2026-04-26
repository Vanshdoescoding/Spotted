import type { ConservationStatus, SensitivityLevel } from "../../security/sightingPrivacy";

export type SpeciesRarity = "common" | "uncommon" | "rare" | "legendary";

export interface Species {
  id: string;
  commonName: string;
  scientificName: string;
  rarity: SpeciesRarity;
  conservationStatus: ConservationStatus;
  sensitivityLevel: SensitivityLevel;
  description: string;
  habitat: string;
  imageColor: string;
  collected: boolean;
  lastPublicSighting?: string;
}

export type { ConservationStatus };
