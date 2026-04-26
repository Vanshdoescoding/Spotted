import { describe, expect, it } from "vitest";

import { listSpecies } from "./species.service";

describe("species service", () => {
  it("returns mock species safely when mock mode is active", async () => {
    const species = await listSpecies();

    expect(species.length).toBeGreaterThan(0);
    expect(species[0]).toHaveProperty("commonName");
  });
});

