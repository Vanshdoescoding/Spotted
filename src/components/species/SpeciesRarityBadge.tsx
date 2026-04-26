import { Badge } from "../ui/Badge";
import type { SpeciesRarity } from "../../features/species/species.types";

const labels: Record<SpeciesRarity, string> = {
  common: "Common",
  uncommon: "Uncommon",
  rare: "Rare",
  legendary: "Legendary",
};

export function SpeciesRarityBadge({ rarity }: { rarity: SpeciesRarity }) {
  return <Badge label={labels[rarity]} tone={rarity === "rare" || rarity === "legendary" ? "warning" : "neutral"} />;
}

