import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppHeader } from "../../src/components/layout/AppHeader";
import { SpeciesCard } from "../../src/components/species/SpeciesCard";
import { Card } from "../../src/components/ui/Card";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingState } from "../../src/components/ui/LoadingState";
import { Screen } from "../../src/components/ui/Screen";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { AppText } from "../../src/components/ui/Text";
import { mockCollection, mockCollectionProgress } from "../../src/features/collection/collection.mock";
import { useSpecies } from "../../src/features/species/species.hooks";
import { colors } from "../../src/lib/theme/colors";
import { spacing } from "../../src/lib/theme/spacing";
import { formatPercent } from "../../src/utils/formatting";

export default function CollectionScreen() {
  const speciesQuery = useSpecies();
  const collectedSpecies = (speciesQuery.data ?? []).filter((species) =>
    mockCollection.some((item) => item.speciesId === species.id),
  );
  const progress = mockCollectionProgress.collectedCount / mockCollectionProgress.totalKnownSpecies;

  return (
    <Screen>
      <AppHeader
        title="Collection"
        subtitle="A living field record that levels up through careful observations."
      />
      <Card>
        <View style={styles.progressHeader}>
          <AppText variant="heading">{formatPercent(progress)}</AppText>
          <AppText color="textMuted">
            {mockCollectionProgress.collectedCount} collected from {mockCollectionProgress.totalKnownSpecies} local species in this development set.
          </AppText>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </Card>

      <SectionHeader title="Collected species" />
      {speciesQuery.isLoading ? <LoadingState label="Loading species" /> : null}
      {speciesQuery.isError ? (
        <ErrorState message="Species could not be loaded. Collection persistence is still mocked in this build." />
      ) : null}
      {collectedSpecies.length > 0 ? (
        collectedSpecies.map((species) => (
          <SpeciesCard
            key={species.id}
            species={species}
            onPress={() => router.push(`/species/${species.id}`)}
          />
        ))
      ) : (
        <EmptyState
          title="No species collected yet"
          message="Your collection will begin when you record your first sighting."
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  progressHeader: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  progressTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    height: 10,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: colors.forest,
    height: "100%",
  },
});
