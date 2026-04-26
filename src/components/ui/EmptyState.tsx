import { StyleSheet, View } from "react-native";
import type { ReactNode } from "react";

import { colors } from "../../lib/theme/colors";
import { spacing } from "../../lib/theme/spacing";
import { AppText } from "./Text";

interface EmptyStateProps {
  title: string;
  message: string;
  action?: ReactNode;
}

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="subheading">{title}</AppText>
      <AppText color="textMuted">{message}</AppText>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.md,
    padding: spacing.xl,
  },
});

