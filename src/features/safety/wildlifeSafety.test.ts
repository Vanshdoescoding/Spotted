import { describe, expect, it } from "vitest";

import {
  getLocationPrivacyCopy,
  getPublicLocationLabel,
  isSensitiveSpecies,
} from "./wildlifeSafety";

describe("wildlife safety copy", () => {
  it("treats endangered species as sensitive even when the base level is public", () => {
    expect(
      isSensitiveSpecies({
        sensitivityLevel: "public",
        conservationStatus: "endangered",
      }),
    ).toBe(true);
  });

  it("uses calm protection copy for sensitive locations", () => {
    expect(
      getLocationPrivacyCopy({
        sensitivityLevel: "sensitive",
        conservationStatus: "vulnerable",
      }),
    ).toBe("Exact location hidden to protect wildlife.");
  });

  it("labels restricted sightings as broad region only", () => {
    expect(
      getPublicLocationLabel({
        sensitivityLevel: "restricted",
        conservationStatus: "critically_endangered",
      }),
    ).toBe("Broad region only");
  });
});

