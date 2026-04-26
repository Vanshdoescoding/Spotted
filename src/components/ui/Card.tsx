import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

import { colors } from "../../lib/theme/colors";
import { radius, spacing } from "../../lib/theme/spacing";

interface CardProps extends ViewProps {
  muted?: boolean;
}

export function Card({ children, muted = false, style, ...props }: PropsWithChildren<CardProps>) {
  return (
    <View style={[styles.card, muted ? styles.muted : null, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
});

