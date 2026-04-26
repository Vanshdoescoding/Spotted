import type { SensitivityLevel } from "../../security/sightingPrivacy";
import type { ConservationStatus, SpeciesRarity } from "../species/species.types";

export type LocationPrivacyLevel = SensitivityLevel;
export type SightingVerificationStatus = "pending" | "community_checked" | "verified" | "rejected";

export interface PublicSighting {
  id: string;
  speciesId: string;
  speciesCommonName: string;
  speciesScientificName?: string;
  speciesImageUrl?: string;
  conservationStatus?: ConservationStatus;
  rarityTier?: SpeciesRarity;
  observedAt: string;
  latitudePublic: number;
  longitudePublic: number;
  publicLocationLabel: string;
  publicAccuracyMeters: number;
  locationPrivacyLevel: LocationPrivacyLevel;
  verificationStatus: SightingVerificationStatus;
  note?: string;
  photoUrl?: string;
  createdAt?: string;
}

export type Sighting = PublicSighting;
export type SightingPreview = Pick<
  PublicSighting,
  | "id"
  | "speciesId"
  | "speciesCommonName"
  | "observedAt"
  | "publicLocationLabel"
  | "locationPrivacyLevel"
  | "verificationStatus"
>;
