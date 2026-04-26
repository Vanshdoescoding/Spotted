import { useLocalSearchParams, router } from "expo-router";
import { StyleSheet, View } from "react-native";

import { AppHeader } from "../../src/components/layout/AppHeader";
import { ConservationStatusBadge } from "../../src/components/species/ConservationStatusBadge";
import { SpeciesRarityBadge } from "../../src/components/species/SpeciesRarityBadge";
import { SightingCard } from "../../src/components/sightings/SightingCard";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { EmptyState } from "../../src/components/ui/EmptyState";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingState } from "../../src/components/ui/LoadingState";
import { Screen } from "../../src/components/ui/Screen";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { AppText } from "../../src/components/ui/Text";
import { useSpeciesDetail } from "../../src/features/species/species.hooks";
import {
  getLocationPrivacyCopy,
  getPublicLocationLabel,
  isSensitiveSpecies,
} from "../../src/features/safety/wildlifeSafety";
import { useSpeciesPublicSightings } from "../../src/features/sightings/sightings.hooks";
import { colors } from "../../src/lib/theme/colors";
import { radius, spacing } from "../../src/lib/theme/spacing";

export default function SpeciesDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const speciesQuery = useSpeciesDetail(id);
  const speciesSightings = useSpeciesPublicSightings(id);
  const species = speciesQuery.data;

  if (speciesQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label="Loading species" />
      </Screen>
    );
  }

  if (speciesQuery.isError || !species) {
    return (
      <Screen>
        <ErrorState message="This species is not available in the development data set." />
        <Button title="Back" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  const privacyProfile = {
    sensitivityLevel: species.sensitivityLevel,
    conservationStatus: species.conservationStatus,
  };

  return (
    <Screen>
      <AppHeader title={species.commonName} subtitle={species.scientificName} />
      <View style={[styles.hero, { backgroundColor: species.imageColor }]}>
        <AppText variant="title" color="white">
          {species.commonName.slice(0, 1)}
        </AppText>
      </View>
      <View style={styles.badges}>
        <SpeciesRarityBadge rarity={species.rarity} />
        <ConservationStatusBadge status={species.conservationStatus} />
      </View>

      <SectionHeader title="Field notes" />
      <Card>
        <AppText>{species.description}</AppText>
        <AppText color="textMuted">{species.habitat}</AppText>
      </Card>

      <SectionHeader title="Location privacy" />
      <Card muted={isSensitiveSpecies(privacyProfile)}>
        <AppText variant="subheading">{getPublicLocationLabel(privacyProfile)}</AppText>
        <AppText color="textMuted">{getLocationPrivacyCopy(privacyProfile)}</AppText>
      </Card>

      <SectionHeader title="Last public sighting" />
      {speciesSightings.isLoading ? <LoadingState label="Loading public sightings" /> : null}
      {speciesSightings.data?.[0] ? (
        <SightingCard sighting={speciesSightings.data[0]} />
      ) : (
        <EmptyState
          title="No public sightings yet"
          message={species.lastPublicSighting ?? "No public sighting summary is available yet."}
        />
      )}

      <Button title={species.collected ? "Collected" : "Not collected yet"} variant="secondary" disabled />
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 180,
    justifyContent: "center",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
