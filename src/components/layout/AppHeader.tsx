import { StyleSheet, View } from "react-native";

import { spacing } from "../../lib/theme/spacing";
import { AppText } from "../ui/Text";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <AppText variant="title">{title}</AppText>
      {subtitle ? <AppText color="textMuted">{subtitle}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
});

