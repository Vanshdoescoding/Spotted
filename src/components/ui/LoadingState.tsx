import { ActivityIndicator, StyleSheet, View } from "react-native";

import { colors } from "../../lib/theme/colors";
import { spacing } from "../../lib/theme/spacing";
import { AppText } from "./Text";

interface LoadingStateProps {
  label?: string;
}

export function LoadingState({ label = "Loading" }: LoadingStateProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.forest} />
      <AppText color="textMuted">{label}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.xl,
  },
});

