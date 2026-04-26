import { useLocalSearchParams, router } from "expo-router";

import { AppHeader } from "../../src/components/layout/AppHeader";
import { PrivacyNotice } from "../../src/components/sightings/PrivacyNotice";
import { SightingCard } from "../../src/components/sightings/SightingCard";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingState } from "../../src/components/ui/LoadingState";
import { Screen } from "../../src/components/ui/Screen";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { AppText } from "../../src/components/ui/Text";
import { usePublicSightingDetail } from "../../src/features/sightings/sightings.hooks";
import { formatObservedAt } from "../../src/utils/dates";

export default function SightingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const sightingQuery = usePublicSightingDetail(id);
  const sighting = sightingQuery.data;

  if (sightingQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label="Loading public sighting" />
      </Screen>
    );
  }

  if (sightingQuery.isError || !sighting) {
    return (
      <Screen>
        <ErrorState message="This sighting is not available in the development data set." />
        <Button title="Back" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <AppHeader title="Sighting detail" subtitle={sighting.speciesCommonName} />
      <SightingCard sighting={sighting} />
      <SectionHeader title="Public location" />
      <Card>
        <AppText color="textMuted">
          Public coordinates are rounded before display: {sighting.latitudePublic.toFixed(2)}, {sighting.longitudePublic.toFixed(2)}.
        </AppText>
        <AppText color="textMuted">
          Observed {formatObservedAt(sighting.observedAt)}. {sighting.publicLocationLabel}; public accuracy around {sighting.publicAccuracyMeters} metres.
        </AppText>
      </Card>
      <PrivacyNotice />
      <Button title="Report sighting" variant="secondary" disabled />
    </Screen>
  );
}
