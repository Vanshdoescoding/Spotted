import { describe, expect, it } from "vitest";

import { mapSpeciesRowToSpecies } from "./species.mapper";

describe("species row mapping", () => {
  it("maps snake_case database rows to camelCase app models", () => {
    const species = mapSpeciesRowToSpecies({
      id: "species-1",
      common_name: "Koala",
      scientific_name: "Phascolarctos cinereus",
      conservation_status: "endangered",
      sensitivity_level: "sensitive",
      rarity_tier: "rare",
    });

    expect(species).toMatchObject({
      id: "species-1",
      commonName: "Koala",
      scientificName: "Phascolarctos cinereus",
      conservationStatus: "endangered",
      sensitivityLevel: "sensitive",
      rarity: "rare",
    });
  });

  it("handles null optional fields with safe defaults", () => {
    const species = mapSpeciesRowToSpecies({
      id: "species-2",
      common_name: null,
      scientific_name: null,
      conservation_status: null,
      sensitivity_level: null,
      rarity_tier: null,
    });

    expect(species.commonName).toBe("Unknown species");
    expect(species.conservationStatus).toBe("not_evaluated");
    expect(species.rarity).toBe("common");
  });
});

