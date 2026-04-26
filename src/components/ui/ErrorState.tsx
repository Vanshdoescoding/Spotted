import { StyleSheet, View } from "react-native";

import { colors } from "../../lib/theme/colors";
import { spacing } from "../../lib/theme/spacing";
import { AppText } from "./Text";

interface ErrorStateProps {
  title?: string;
  message: string;
}

export function ErrorState({ title = "Something needs attention", message }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <AppText variant="subheading" color="danger">
        {title}
      </AppText>
      <AppText color="textMuted">{message}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    gap: spacing.sm,
    padding: spacing.lg,
  },
});

