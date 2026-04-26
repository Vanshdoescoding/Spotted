import { env } from "../../lib/config/env";
import { DataServiceError, shouldUseMockFallback } from "../../lib/data/serviceError";
import { supabaseMaybe } from "../../lib/supabase/client";
import { getPublicLocationLabel } from "../safety/wildlifeSafety";
import { listSpecies } from "../species/species.service";
import type { Species } from "../species/species.types";
import { mockPublicSightings } from "./sightings.mock";
import { mapPublicSightingRowToPublicSighting } from "./sightings.mapper";
import type { PublicSighting } from "./sightings.types";

export interface NearbySightingsParams {
  latitudePublic?: number;
  longitudePublic?: number;
  limit?: number;
}

export interface MapSightingsParams {
  limit?: number;
}

const publicSightingsSelect =
  "id, species_id, observed_at, note, latitude, longitude, accuracy_m, location_privacy_level, status, created_at";

export async function readRecentPublicSightings(limit = 10): Promise<PublicSighting[]> {
  if (env.useMockData || !supabaseMaybe) {
    return mockPublicSightings.slice(0, limit);
  }

  const { data, error } = await supabaseMaybe
    .from("public_sightings")
    .select(publicSightingsSelect)
    .order("observed_at", { ascending: false })
    .limit(limit);

  if (error) {
    return handleSightingsError(error, mockPublicSightings.slice(0, limit));
  }

  return mapPublicSightingRows(data ?? []);
}

export async function readPublicSightingById(id: string): Promise<PublicSighting | undefined> {
  if (env.useMockData || !supabaseMaybe) {
    return mockPublicSightings.find((sighting) => sighting.id === id);
  }

  const { data, error } = await supabaseMaybe
    .from("public_sightings")
    .select(publicSightingsSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return handleSightingsError(
      error,
      mockPublicSightings.find((sighting) => sighting.id === id),
    );
  }

  if (!data) {
    return undefined;
  }

  const [mapped] = await mapPublicSightingRows([data]);
  return mapped;
}

export async function readPublicSightingsForSpecies(
  speciesId: string,
): Promise<PublicSighting[]> {
  if (env.useMockData || !supabaseMaybe) {
    return mockPublicSightings.filter((sighting) => sighting.speciesId === speciesId);
  }

  const { data, error } = await supabaseMaybe
    .from("public_sightings")
    .select(publicSightingsSelect)
    .eq("species_id", speciesId)
    .order("observed_at", { ascending: false });

  if (error) {
    return handleSightingsError(
      error,
      mockPublicSightings.filter((sighting) => sighting.speciesId === speciesId),
    );
  }

  return mapPublicSightingRows(data ?? []);
}

export async function readPublicSightingsForMap(
  params: MapSightingsParams = {},
): Promise<PublicSighting[]> {
  return readRecentPublicSightings(params.limit ?? 50);
}

export async function readNearbyPublicSightings(
  params: NearbySightingsParams,
): Promise<PublicSighting[]> {
  const sightings = await readRecentPublicSightings(params.limit ?? 20);

  if (params.latitudePublic === undefined || params.longitudePublic === undefined) {
    return sightings;
  }

  return sightings;
}

async function mapPublicSightingRows(rows: unknown[]): Promise<PublicSighting[]> {
  const species = await listSpecies();
  const speciesById = new Map<string, Species>(
    species.map((item) => [item.id, item]),
  );

  return rows.map((row) => {
    const speciesId = getSpeciesId(row);
    return mapPublicSightingRowToPublicSighting(
      row,
      speciesId ? speciesById.get(speciesId) : undefined,
    );
  });
}

function getSpeciesId(row: unknown): string | undefined {
  if (typeof row === "object" && row !== null && "species_id" in row) {
    const value = (row as { species_id?: unknown }).species_id;
    return typeof value === "string" ? value : undefined;
  }

  return undefined;
}

function handleSightingsError<T>(error: unknown, fallback: T): T {
  if (shouldUseMockFallback()) {
    return fallback;
  }

  throw new DataServiceError("Unable to load public sightings.", error);
}

export function getPublicLocationLabelForSighting(sighting: PublicSighting): string {
  return getPublicLocationLabel({
    sensitivityLevel: sighting.locationPrivacyLevel,
    conservationStatus: sighting.conservationStatus ?? "least_concern",
    publicPrecisionMeters: sighting.publicAccuracyMeters,
  });
}

