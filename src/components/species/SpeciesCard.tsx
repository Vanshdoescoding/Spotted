import { Pressable, StyleSheet, View } from "react-native";

import type { Species } from "../../features/species/species.types";
import { colors } from "../../lib/theme/colors";
import { radius, spacing } from "../../lib/theme/spacing";
import { AppText } from "../ui/Text";
import { Card } from "../ui/Card";
import { ConservationStatusBadge } from "./ConservationStatusBadge";
import { SpeciesRarityBadge } from "./SpeciesRarityBadge";

interface SpeciesCardProps {
  species: Species;
  onPress?: () => void;
}

export function SpeciesCard({ species, onPress }: SpeciesCardProps) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={!onPress}>
      <Card style={styles.card}>
        <View style={[styles.image, { backgroundColor: species.imageColor }]}>
          <AppText variant="heading" color="white">
            {species.commonName.slice(0, 1)}
          </AppText>
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <AppText variant="subheading">{species.commonName}</AppText>
            {species.collected ? <AppText variant="caption" color="forest" weight="700">Collected</AppText> : null}
          </View>
          <AppText variant="caption" color="textMuted">
            {species.scientificName}
          </AppText>
          <View style={styles.badges}>
            <SpeciesRarityBadge rarity={species.rarity} />
            <ConservationStatusBadge status={species.conservationStatus} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  image: {
    alignItems: "center",
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    height: 76,
    justifyContent: "center",
    width: 76,
  },
  body: {
    flex: 1,
    gap: spacing.sm,
  },
  titleRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  badges: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});

