import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppHeader } from "../../src/components/layout/AppHeader";
import { SightingMap } from "../../src/components/map/SightingMap";
import { SightingCard } from "../../src/components/sightings/SightingCard";
import { Badge } from "../../src/components/ui/Badge";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingState } from "../../src/components/ui/LoadingState";
import { Screen } from "../../src/components/ui/Screen";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { AppText } from "../../src/components/ui/Text";
import { usePublicSightingsForMap } from "../../src/features/sightings/sightings.hooks";
import { spacing } from "../../src/lib/theme/spacing";

const filters = ["Nearby", "Recent", "Rare", "Verified"];

export default function MapScreen() {
  const mapSightings = usePublicSightingsForMap();

  return (
    <Screen>
      <AppHeader
        title="Map"
        subtitle="Sightings appear as approximate public locations. Sensitive species are blurred before they reach the map."
      />
      <View style={styles.filters}>
        {filters.map((filter) => (
          <Badge key={filter} label={filter} tone={filter === "Nearby" ? "success" : "neutral"} />
        ))}
      </View>
      {mapSightings.isLoading ? <LoadingState label="Loading public map sightings" /> : null}
      {mapSightings.isError ? (
        <ErrorState message="The public map could not be loaded. Private coordinates are never requested by this screen." />
      ) : null}
      {mapSightings.data ? <SightingMap sightings={mapSightings.data} /> : null}
      <AppText color="textMuted">
        Exact locations may be hidden or rounded to protect wildlife and the people who report it.
      </AppText>
      <SectionHeader title="Nearby public sightings" />
      {mapSightings.data?.length === 0 ? (
        <EmptyState
          title="No public sightings on the map"
          message="Approved community sightings will appear here using public-safe coordinates."
        />
      ) : null}
      {mapSightings.data?.map((sighting) => (
        <SightingCard
          key={sighting.id}
          sighting={sighting}
          onPress={() => router.push(`/sightings/${sighting.id}`)}
        />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
