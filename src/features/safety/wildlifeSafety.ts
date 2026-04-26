import {
  getPublicPrecisionMeters,
  isSensitiveSpecies as isSensitiveSpeciesProfile,
  type ConservationStatus,
  type SensitivityLevel,
} from "../../security/sightingPrivacy";

interface PrivacyProfile {
  sensitivityLevel: SensitivityLevel;
  conservationStatus: ConservationStatus;
  publicPrecisionMeters?: number;
}

export const wildlifeSafetyCopy = {
  short: "Exact location hidden to protect wildlife.",
  standard: "Spotted may blur public locations for sensitive species so people can learn from sightings without putting wildlife at risk.",
  field: "Keep your distance, stay on marked paths where possible, and never disturb habitat for a clearer photo.",
} as const;

export function isSensitiveSpecies(profile: PrivacyProfile): boolean {
  return isSensitiveSpeciesProfile(toSecurityProfile(profile));
}

export function getLocationPrivacyCopy(profile: PrivacyProfile): string {
  if (profile.sensitivityLevel === "restricted") {
    return "This species has extra protection. Public sightings show only a broad area.";
  }

  if (isSensitiveSpecies(profile)) {
    return "Exact location hidden to protect wildlife.";
  }

  return "Public map locations are approximate, not exact.";
}

export function getPublicLocationLabel(profile: PrivacyProfile): string {
  const precision = getPublicPrecisionMeters(toSecurityProfile(profile));

  if (precision >= 50000) {
    return "Broad region only";
  }

  if (precision >= 10000) {
    return "Approximate area";
  }

  return "Approximate location";
}

function toSecurityProfile(profile: PrivacyProfile) {
  const base = {
    sensitivityLevel: profile.sensitivityLevel,
    conservationStatus: profile.conservationStatus,
  };

  return profile.publicPrecisionMeters === undefined
    ? base
    : { ...base, publicPrecisionMeters: profile.publicPrecisionMeters };
}
