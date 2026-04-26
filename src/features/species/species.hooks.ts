import { useQuery } from "@tanstack/react-query";

import {
  getSpeciesById,
  listSpecies,
  listSpeciesByRarity,
  searchSpecies,
} from "./species.service";
import type { SpeciesRarity } from "./species.types";

export const speciesQueryKeys = {
  all: ["species"] as const,
  detail: (id: string) => ["species", id] as const,
  search: (query: string) => ["species", "search", query] as const,
  rarity: (rarity: SpeciesRarity) => ["species", "rarity", rarity] as const,
};

export function useSpecies() {
  return useQuery({
    queryKey: speciesQueryKeys.all,
    queryFn: listSpecies,
  });
}

export function useSpeciesDetail(id: string | undefined) {
  return useQuery({
    queryKey: speciesQueryKeys.detail(id ?? "missing"),
    queryFn: () => (id ? getSpeciesById(id) : undefined),
    enabled: Boolean(id),
  });
}

export function useSpeciesSearch(query: string) {
  return useQuery({
    queryKey: speciesQueryKeys.search(query),
    queryFn: () => searchSpecies(query),
  });
}

export function useSpeciesByRarity(rarity: SpeciesRarity) {
  return useQuery({
    queryKey: speciesQueryKeys.rarity(rarity),
    queryFn: () => listSpeciesByRarity(rarity),
  });
}

