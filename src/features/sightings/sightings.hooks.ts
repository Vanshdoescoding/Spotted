import { useQuery } from "@tanstack/react-query";

import {
  getPublicSightingById,
  listPublicSightingsForMap,
  listPublicSightingsForSpecies,
  listRecentPublicSightings,
} from "./sightings.service";

export const publicSightingQueryKeys = {
  recent: (limit?: number) => ["publicSightings", "recent", limit ?? "default"] as const,
  detail: (id: string) => ["publicSightings", id] as const,
  species: (speciesId: string) => ["publicSightings", "species", speciesId] as const,
  map: () => ["publicSightings", "map"] as const,
};

export function useRecentPublicSightings(limit?: number) {
  return useQuery({
    queryKey: publicSightingQueryKeys.recent(limit),
    queryFn: () => listRecentPublicSightings(limit),
  });
}

export function usePublicSightingDetail(id: string | undefined) {
  return useQuery({
    queryKey: publicSightingQueryKeys.detail(id ?? "missing"),
    queryFn: () => (id ? getPublicSightingById(id) : undefined),
    enabled: Boolean(id),
  });
}

export function useSpeciesPublicSightings(speciesId: string | undefined) {
  return useQuery({
    queryKey: publicSightingQueryKeys.species(speciesId ?? "missing"),
    queryFn: () => (speciesId ? listPublicSightingsForSpecies(speciesId) : []),
    enabled: Boolean(speciesId),
  });
}

export function usePublicSightingsForMap() {
  return useQuery({
    queryKey: publicSightingQueryKeys.map(),
    queryFn: () => listPublicSightingsForMap({ limit: 50 }),
  });
}

