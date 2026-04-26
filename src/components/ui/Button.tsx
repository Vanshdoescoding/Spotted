import type { ReactNode } from "react";
import { Pressable, StyleSheet, View, type PressableProps } from "react-native";

import { colors } from "../../lib/theme/colors";
import { radius, spacing } from "../../lib/theme/spacing";
import { AppText } from "./Text";

type ButtonVariant = "primary" | "secondary" | "quiet" | "danger";

interface ButtonProps extends PressableProps {
  title: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
}

export function Button({ title, variant = "primary", icon, style, disabled, ...props }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      style={(state) => [
        styles.base,
        styles[variant],
        state.pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <View style={styles.content}>
        {icon}
        <AppText
          variant="body"
          weight="700"
          color={variant === "primary" || variant === "danger" ? "white" : "forest"}
        >
          {title}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.forest,
  },
  secondary: {
    backgroundColor: colors.forestSoft,
    borderColor: colors.forest,
    borderWidth: StyleSheet.hairlineWidth,
  },
  quiet: {
    backgroundColor: "transparent",
  },
  danger: {
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: 0.78,
  },
  disabled: {
    opacity: 0.45,
  },
});
