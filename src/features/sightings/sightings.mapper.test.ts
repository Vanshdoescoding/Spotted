import { describe, expect, it } from "vitest";

import { mapPublicSightingRowToPublicSighting } from "./sightings.mapper";

describe("public sighting row mapping", () => {
  it("maps public view coordinates to public coordinate fields only", () => {
    const sighting = mapPublicSightingRowToPublicSighting({
      id: "sighting-1",
      species_id: "species-1",
      species_common_name: "Koala",
      observed_at: "2026-04-26T00:00:00.000Z",
      latitude: -33.8,
      longitude: 151.1,
      accuracy_m: 10000,
      location_privacy_level: "sensitive",
      status: "approved",
      latitudePrivate: -33.812345,
      longitudePrivate: 151.112345,
    });

    expect(sighting.latitudePublic).toBe(-33.8);
    expect(sighting.longitudePublic).toBe(151.1);
    expect(Object.keys(sighting)).not.toContain("latitudePrivate");
    expect(Object.keys(sighting)).not.toContain("longitudePrivate");
  });

  it("adds protected public labels for sensitive locations", () => {
    const sighting = mapPublicSightingRowToPublicSighting({
      id: "sighting-2",
      species_id: "species-2",
      species_common_name: "Powerful Owl",
      observed_at: "2026-04-26T00:00:00.000Z",
      latitude: -33.7,
      longitude: 151.0,
      accuracy_m: 10000,
      location_privacy_level: "sensitive",
      conservation_status: "vulnerable",
      status: "approved",
      note: null,
    });

    expect(sighting.publicLocationLabel).toBe("Approximate area");
    expect(sighting.photoUrl).toBeUndefined();
    expect(sighting.note).toBeUndefined();
  });
});

