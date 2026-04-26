import { Pressable, StyleSheet, View } from "react-native";

import type { PublicSighting } from "../../features/sightings/sightings.types";
import { formatObservedAt } from "../../utils/dates";
import { spacing } from "../../lib/theme/spacing";
import { AppText } from "../ui/Text";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { PrivacyNotice } from "./PrivacyNotice";
import { VerificationBadge } from "./VerificationBadge";

interface SightingCardProps {
  sighting: PublicSighting;
  onPress?: () => void;
}

export function SightingCard({ sighting, onPress }: SightingCardProps) {
  const hasProtectedLocation = sighting.locationPrivacyLevel !== "public";

  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={!onPress}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View style={styles.title}>
            <AppText variant="subheading">{sighting.speciesCommonName}</AppText>
            <AppText variant="caption" color="textMuted">
              {formatObservedAt(sighting.observedAt)}
            </AppText>
          </View>
          <VerificationBadge status={sighting.verificationStatus} />
        </View>
        {sighting.note ? <AppText color="textMuted">{sighting.note}</AppText> : null}
        <View style={styles.badges}>
          <Badge
            label={sighting.publicLocationLabel}
            tone={hasProtectedLocation ? "warning" : "neutral"}
          />
          {hasProtectedLocation ? <Badge label="Location protected" tone="warning" /> : null}
        </View>
        {hasProtectedLocation ? <PrivacyNotice /> : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    gap: spacing.xs,
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
