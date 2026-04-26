import { StyleSheet, View } from "react-native";

import type { PermissionPurpose } from "../../features/permissions/permissions.types";
import { getPermissionCopy } from "../../features/permissions/permissions.service";
import { spacing } from "../../lib/theme/spacing";
import { Card } from "../ui/Card";
import { AppText } from "../ui/Text";

interface PermissionExplainerProps {
  purposes: PermissionPurpose[];
}

export function PermissionExplainer({ purposes }: PermissionExplainerProps) {
  return (
    <View style={styles.list}>
      {purposes.map((purpose) => {
        const copy = getPermissionCopy(purpose);

        return (
          <Card key={purpose} muted>
            <AppText variant="subheading">{copy.title}</AppText>
            <AppText color="textMuted">{copy.body}</AppText>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.md,
  },
});

