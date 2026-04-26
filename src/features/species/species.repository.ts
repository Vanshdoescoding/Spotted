import { env } from "../../lib/config/env";
import { DataServiceError, shouldUseMockFallback } from "../../lib/data/serviceError";
import { supabaseMaybe } from "../../lib/supabase/client";
import { mockSpecies } from "./species.mock";
import { mapSpeciesRowToSpecies } from "./species.mapper";
import type { Species, SpeciesRarity } from "./species.types";

const speciesSelect =
  "id, common_name, scientific_name, conservation_status, sensitivity_level, public_precision_m, created_at";

export async function readSpecies(): Promise<Species[]> {
  if (env.useMockData || !supabaseMaybe) {
    return mockSpecies;
  }

  const { data, error } = await supabaseMaybe
    .from("species")
    .select(speciesSelect)
    .order("common_name", { ascending: true });

  if (error) {
    return handleSpeciesError(error, mockSpecies);
  }

  return (data ?? []).map(mapSpeciesRowToSpecies);
}

export async function readSpeciesById(id: string): Promise<Species | undefined> {
  if (env.useMockData || !supabaseMaybe) {
    return mockSpecies.find((species) => species.id === id);
  }

  const { data, error } = await supabaseMaybe
    .from("species")
    .select(speciesSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return handleSpeciesError(error, mockSpecies.find((species) => species.id === id));
  }

  return data ? mapSpeciesRowToSpecies(data) : undefined;
}

export async function readSpeciesByRarity(rarity: SpeciesRarity): Promise<Species[]> {
  const species = await readSpecies();
  return species.filter((item) => item.rarity === rarity);
}

export async function readSensitiveSpecies(): Promise<Species[]> {
  const species = await readSpecies();
  return species.filter((item) => item.sensitivityLevel !== "public");
}

function handleSpeciesError<T>(error: unknown, fallback: T): T {
  if (shouldUseMockFallback()) {
    return fallback;
  }

  throw new DataServiceError("Unable to load species.", error);
}

