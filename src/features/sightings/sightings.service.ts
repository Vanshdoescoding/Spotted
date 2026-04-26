import {
  type MapSightingsParams,
  type NearbySightingsParams,
  readNearbyPublicSightings,
  readPublicSightingById,
  readPublicSightingsForMap,
  readPublicSightingsForSpecies,
  readRecentPublicSightings,
} from "./sightings.repository";
import type { PublicSighting } from "./sightings.types";

export async function listRecentPublicSightings(limit?: number): Promise<PublicSighting[]> {
  return readRecentPublicSightings(limit);
}

export async function getPublicSightingById(id: string): Promise<PublicSighting | undefined> {
  return readPublicSightingById(id);
}

export async function listNearbyPublicSightings(
  params: NearbySightingsParams,
): Promise<PublicSighting[]> {
  return readNearbyPublicSightings(params);
}

export async function listPublicSightingsForSpecies(
  speciesId: string,
): Promise<PublicSighting[]> {
  return readPublicSightingsForSpecies(speciesId);
}

export async function listPublicSightingsForMap(
  params: MapSightingsParams = {},
): Promise<PublicSighting[]> {
  return readPublicSightingsForMap(params);
}

export async function getPublicSightings(): Promise<PublicSighting[]> {
  return listRecentPublicSightings();
}

export function listPublicSightingCoordinateKeys(sighting: PublicSighting): string[] {
  return Object.keys(sighting).filter(
    (key) => key.toLowerCase().includes("latitude") || key.toLowerCase().includes("longitude"),
  );
}
