import { ShieldCheck } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { colors } from "../../lib/theme/colors";
import { spacing } from "../../lib/theme/spacing";
import { AppText } from "../ui/Text";

interface PrivacyNoticeProps {
  message?: string;
}

export function PrivacyNotice({ message = "Exact location hidden to protect wildlife." }: PrivacyNoticeProps) {
  return (
    <View style={styles.container}>
      <ShieldCheck color={colors.amber} size={18} strokeWidth={2.2} />
      <AppText variant="caption" color="textMuted" style={styles.text}>
        {message}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.amberSoft,
    borderRadius: 8,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md,
  },
  text: {
    flex: 1,
  },
});

