import { StyleSheet, View } from "react-native";

import { spacing } from "../../lib/theme/spacing";
import { AppText } from "./Text";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
}

export function SectionHeader({ title, actionLabel }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <AppText variant="subheading">{title}</AppText>
      {actionLabel ? (
        <AppText variant="caption" color="forest" weight="700">
          {actionLabel}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
  },
});

