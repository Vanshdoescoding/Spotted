import type { CollectionProgress, UserCollectionItem } from "./collection.types";

export const mockCollection: UserCollectionItem[] = [
  {
    id: "collection-1",
    speciesId: "superb-fairy-wren",
    speciesCommonName: "Superb Fairy-wren",
    rarity: "common",
    level: 3,
    sightingsLogged: 5,
    collectedAt: "2026-04-18T04:30:00.000Z",
  },
  {
    id: "collection-2",
    speciesId: "koala",
    speciesCommonName: "Koala",
    rarity: "rare",
    level: 1,
    sightingsLogged: 1,
    collectedAt: "2026-04-20T08:10:00.000Z",
  },
];

export const mockCollectionProgress: CollectionProgress = {
  collectedCount: 2,
  totalKnownSpecies: 12,
};

