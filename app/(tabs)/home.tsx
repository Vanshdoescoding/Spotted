import { router } from "expo-router";
import { Camera, MapPinned } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppHeader } from "../../src/components/layout/AppHeader";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { Screen } from "../../src/components/ui/Screen";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { AppText } from "../../src/components/ui/Text";
import { PrivacyNotice } from "../../src/components/sightings/PrivacyNotice";
import { SightingCard } from "../../src/components/sightings/SightingCard";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingState } from "../../src/components/ui/LoadingState";
import { PRODUCT_LINE } from "../../src/constants/app";
import { mockCollectionProgress } from "../../src/features/collection/collection.mock";
import { useRecentPublicSightings } from "../../src/features/sightings/sightings.hooks";
import { colors } from "../../src/lib/theme/colors";
import { spacing } from "../../src/lib/theme/spacing";
import { formatPercent } from "../../src/utils/formatting";

export default function HomeScreen() {
  const progress = mockCollectionProgress.collectedCount / mockCollectionProgress.totalKnownSpecies;
  const recentSightings = useRecentPublicSightings(2);

  return (
    <Screen>
      <AppHeader title="Spotted" subtitle={PRODUCT_LINE} />
      <View style={styles.actions}>
        <Button
          title="Record a sighting"
          icon={<Camera color={colors.white} size={18} />}
          onPress={() => router.push("/add")}
        />
        <Button
          title="Explore nearby sightings"
          variant="secondary"
          icon={<MapPinned color={colors.forest} size={18} />}
          onPress={() => router.push("/map")}
        />
      </View>

      <PrivacyNotice message="Spotted helps you log wildlife without putting it at risk." />

      <SectionHeader title="Recent public sightings" />
      {recentSightings.isLoading ? <LoadingState label="Loading public sightings" /> : null}
      {recentSightings.isError ? (
        <ErrorState message="Public sightings could not be loaded. You can still record field notes locally in a later build." />
      ) : null}
      {recentSightings.data?.length === 0 ? (
        <EmptyState
          title="No public sightings yet"
          message="When approved sightings are available, they will appear here with protected public locations."
        />
      ) : null}
      {recentSightings.data?.map((sighting) => (
          <SightingCard
            key={sighting.id}
            sighting={sighting}
            onPress={() => router.push(`/sightings/${sighting.id}`)}
          />
        ))}

      <SectionHeader title="Collection progress" />
      <Card>
        <View style={styles.progressHeader}>
          <AppText variant="subheading">
            {mockCollectionProgress.collectedCount} of {mockCollectionProgress.totalKnownSpecies} species
          </AppText>
          <AppText color="forest" weight="700">
            {formatPercent(progress)}
          </AppText>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <AppText color="textMuted">
          Collection levels grow from sightings and verified observations, not from streak pressure.
        </AppText>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
  },
  progressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  progressTrack: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    height: 10,
    marginBottom: spacing.md,
    overflow: "hidden",
  },
  progressFill: {
    backgroundColor: colors.forest,
    height: "100%",
  },
});
