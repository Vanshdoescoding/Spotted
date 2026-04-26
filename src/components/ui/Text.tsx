import type { PropsWithChildren } from "react";
import { Text as NativeText, StyleSheet, type TextProps, type TextStyle } from "react-native";

import { colors } from "../../lib/theme/colors";
import { typography } from "../../lib/theme/typography";

type TextVariant = "title" | "heading" | "subheading" | "body" | "caption";

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: keyof typeof colors;
  weight?: TextStyle["fontWeight"];
}

export function AppText({
  children,
  variant = "body",
  color = "text",
  weight,
  style,
  ...props
}: PropsWithChildren<AppTextProps>) {
  return (
    <NativeText
      {...props}
      style={[styles.base, typography[variant], { color: colors[color] }, weight ? { fontWeight: weight } : null, style]}
    >
      {children}
    </NativeText>
  );
}

const styles = StyleSheet.create({
  base: {
    letterSpacing: 0,
  },
});

