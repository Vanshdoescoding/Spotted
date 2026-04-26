import { describe, expect, it } from "vitest";

import {
  getPublicSightings,
  listPublicSightingCoordinateKeys,
} from "./sightings.service";

describe("public sightings service", () => {
  it("returns only public coordinate fields", async () => {
    const sightings = await getPublicSightings();
    const coordinateKeys = sightings.flatMap(listPublicSightingCoordinateKeys);

    expect(coordinateKeys).toContain("latitudePublic");
    expect(coordinateKeys).toContain("longitudePublic");
    expect(coordinateKeys).not.toContain("latitudePrivate");
    expect(coordinateKeys).not.toContain("longitudePrivate");
  });

  it("does not expose private coordinate keys anywhere on public sighting objects", async () => {
    const sightings = await getPublicSightings();
    const keys = sightings.flatMap((sighting) => Object.keys(sighting));

    expect(keys).not.toContain("latitudePrivate");
    expect(keys).not.toContain("longitudePrivate");
  });
});
