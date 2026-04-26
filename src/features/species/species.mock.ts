import type { Species } from "./species.types";

export const mockSpecies: Species[] = [
  {
    id: "superb-fairy-wren",
    commonName: "Superb Fairy-wren",
    scientificName: "Malurus cyaneus",
    rarity: "common",
    conservationStatus: "least_concern",
    sensitivityLevel: "public",
    description: "A small woodland bird often seen moving through low shrubs and garden edges.",
    habitat: "Urban bushland, heath, parks, and scrubby forest edges.",
    imageColor: "#8AA7C7",
    collected: true,
    lastPublicSighting: "Seen near a creek reserve, location rounded for privacy.",
  },
  {
    id: "koala",
    commonName: "Koala",
    scientificName: "Phascolarctos cinereus",
    rarity: "rare",
    conservationStatus: "endangered",
    sensitivityLevel: "sensitive",
    description: "A tree-dwelling marsupial closely tied to mature eucalyptus habitat.",
    habitat: "Eucalyptus woodland and connected habitat corridors.",
    imageColor: "#9CA39A",
    collected: true,
    lastPublicSighting: "Approximate area only. Exact location hidden to protect wildlife.",
  },
  {
    id: "eastern-water-dragon",
    commonName: "Eastern Water Dragon",
    scientificName: "Intellagama lesueurii",
    rarity: "uncommon",
    conservationStatus: "least_concern",
    sensitivityLevel: "public",
    description: "A large lizard often found basking close to water and rocky banks.",
    habitat: "Creeks, rivers, wet gullies, and parkland waterways.",
    imageColor: "#8EA57F",
    collected: false,
    lastPublicSighting: "Logged near public parkland.",
  },
];

