import { StyleSheet, View } from "react-native";

import { colors } from "../../lib/theme/colors";
import { radius, spacing } from "../../lib/theme/spacing";
import { AppText } from "./Text";

type BadgeTone = "neutral" | "success" | "warning" | "danger";

interface BadgeProps {
  label: string;
  tone?: BadgeTone;
}

export function Badge({ label, tone = "neutral" }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[tone]]}>
      <AppText variant="caption" weight="700" color={tone === "danger" ? "danger" : "forest"}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  neutral: {
    backgroundColor: colors.surfaceMuted,
  },
  success: {
    backgroundColor: colors.forestSoft,
  },
  warning: {
    backgroundColor: colors.amberSoft,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
  },
});

