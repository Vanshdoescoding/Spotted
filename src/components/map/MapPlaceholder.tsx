import { MapPin } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import type { PublicSighting } from "../../features/sightings/sightings.types";
import { colors } from "../../lib/theme/colors";
import { radius, spacing } from "../../lib/theme/spacing";
import { AppText } from "../ui/Text";
import { Badge } from "../ui/Badge";

interface MapPlaceholderProps {
  sightings: PublicSighting[];
}

export function MapPlaceholder({ sightings }: MapPlaceholderProps) {
  return (
    <View style={styles.map}>
      <View style={styles.gridLineHorizontal} />
      <View style={styles.gridLineVertical} />
      {sightings.slice(0, 3).map((sighting, index) => (
        <View
          key={sighting.id}
          style={[
            styles.pin,
            {
              left: `${24 + index * 24}%`,
              top: `${34 + (index % 2) * 22}%`,
            },
          ]}
        >
          <MapPin color={colors.forest} size={18} strokeWidth={2.4} />
        </View>
      ))}
      <View style={styles.caption}>
        <AppText variant="subheading">Public sighting map</AppText>
        <AppText color="textMuted">
          Development map placeholder using blurred public coordinates only.
        </AppText>
        <Badge label="Exact sensitive locations are never shown" tone="warning" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    aspectRatio: 1.28,
    backgroundColor: colors.forestSoft,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    padding: spacing.lg,
  },
  gridLineHorizontal: {
    backgroundColor: colors.white,
    height: StyleSheet.hairlineWidth,
    left: 0,
    opacity: 0.7,
    position: "absolute",
    right: 0,
    top: "52%",
  },
  gridLineVertical: {
    backgroundColor: colors.white,
    bottom: 0,
    left: "46%",
    opacity: 0.7,
    position: "absolute",
    top: 0,
    width: StyleSheet.hairlineWidth,
  },
  pin: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    position: "absolute",
    width: 36,
  },
  caption: {
    bottom: spacing.lg,
    gap: spacing.sm,
    left: spacing.lg,
    position: "absolute",
    right: spacing.lg,
  },
});

