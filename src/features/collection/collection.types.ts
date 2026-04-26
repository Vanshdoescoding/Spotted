import type { SpeciesRarity } from "../species/species.types";

export interface UserCollectionItem {
  id: string;
  speciesId: string;
  speciesCommonName: string;
  rarity: SpeciesRarity;
  level: number;
  sightingsLogged: number;
  collectedAt: string;
}

export interface CollectionProgress {
  collectedCount: number;
  totalKnownSpecies: number;
}

