import { describe, expect, it } from "vitest";

import {
  containsCoordinateLeak,
  getPublicCoordinate,
  getPublicPrecisionMeters,
  sightingSubmissionSchema,
} from "./sightingPrivacy.js";

describe("sighting privacy", () => {
  it("rejects notes that expose exact coordinates", () => {
    const result = sightingSubmissionSchema.safeParse({
      speciesId: "8b8281b9-8732-4f4f-b0e4-e1af6ab39b29",
      observedAt: new Date(),
      latitude: -33.8688,
      longitude: 151.2093,
      note: "Nest is at -33.86880, 151.20930 behind the track.",
    });

    expect(result.success).toBe(false);
    expect(containsCoordinateLeak("-33.86880, 151.20930")).toBe(true);
  });

  it("requires at least 10km public precision for vulnerable species", () => {
    const precision = getPublicPrecisionMeters({
      sensitivityLevel: "public",
      conservationStatus: "vulnerable",
    });

    expect(precision).toBeGreaterThanOrEqual(10000);
  });

  it("returns blurred public coordinates instead of exact coordinates", () => {
    const publicCoordinate = getPublicCoordinate(-33.8688, 151.2093, {
      sensitivityLevel: "sensitive",
      conservationStatus: "endangered",
    });

    expect(publicCoordinate.accuracyMeters).toBeGreaterThanOrEqual(10000);
    expect(publicCoordinate.latitude).not.toBe(-33.8688);
    expect(publicCoordinate.longitude).not.toBe(151.2093);
  });

  it("rejects observations that are far in the future", () => {
    const result = sightingSubmissionSchema.safeParse({
      speciesId: "8b8281b9-8732-4f4f-b0e4-e1af6ab39b29",
      observedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      latitude: -33.8688,
      longitude: 151.2093,
    });

    expect(result.success).toBe(false);
  });
});

