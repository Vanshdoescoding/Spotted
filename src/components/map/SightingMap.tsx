import type { PublicSighting } from "../../features/sightings/sightings.types";
import { MapPlaceholder } from "./MapPlaceholder";

interface SightingMapProps {
  sightings: PublicSighting[];
}

export function SightingMap({ sightings }: SightingMapProps) {
  return <MapPlaceholder sightings={sightings} />;
}

