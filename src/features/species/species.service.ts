import {
  readSensitiveSpecies,
  readSpecies,
  readSpeciesById,
  readSpeciesByRarity,
} from "./species.repository";
import type { Species, SpeciesRarity } from "./species.types";

export async function listSpecies(): Promise<Species[]> {
  return readSpecies();
}

export async function getSpeciesById(id: string): Promise<Species | undefined> {
  return readSpeciesById(id);
}

export async function searchSpecies(query: string): Promise<Species[]> {
  const normalizedQuery = query.trim().toLowerCase();
  const species = await listSpecies();

  if (!normalizedQuery) {
    return species;
  }

  return species.filter(
    (item) =>
      item.commonName.toLowerCase().includes(normalizedQuery) ||
      item.scientificName.toLowerCase().includes(normalizedQuery),
  );
}

export async function listSpeciesByRarity(rarity: SpeciesRarity): Promise<Species[]> {
  return readSpeciesByRarity(rarity);
}

export async function listSensitiveSpecies(): Promise<Species[]> {
  return readSensitiveSpecies();
}

export async function getSpecies(): Promise<Species[]> {
  return listSpecies();
}
