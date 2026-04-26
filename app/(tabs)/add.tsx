import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Camera, Image, MapPin } from "lucide-react-native";

import { AppHeader } from "../../src/components/layout/AppHeader";
import { PermissionExplainer } from "../../src/components/permissions/PermissionExplainer";
import { PrivacyNotice } from "../../src/components/sightings/PrivacyNotice";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { Screen } from "../../src/components/ui/Screen";
import { AppText } from "../../src/components/ui/Text";
import {
  getPermissionCopy,
  requestPermission,
} from "../../src/features/permissions/permissions.service";
import type { PermissionPurpose } from "../../src/features/permissions/permissions.types";
import { wildlifeSafetyCopy } from "../../src/features/safety/wildlifeSafety";
import { colors } from "../../src/lib/theme/colors";
import { spacing } from "../../src/lib/theme/spacing";

export default function AddScreen() {
  const [lastResult, setLastResult] = useState<string | null>(null);

  async function handlePermissionIntent(purpose: PermissionPurpose) {
    const result = await requestPermission(purpose);
    const copy = getPermissionCopy(purpose);

    if (result === "granted" || result === "limited") {
      setLastResult(`${copy.title} access is ready for the next step.`);
      return;
    }

    setLastResult(copy.deniedNextStep);
    Alert.alert(`${copy.title} access`, copy.deniedNextStep);
  }

  return (
    <Screen>
      <AppHeader
        title="Record a sighting"
        subtitle="Start with evidence if you have it. You can also log a careful observation without a photo."
      />

      <Card>
        <AppText variant="subheading">Before iOS asks</AppText>
        <AppText color="textMuted">
          Spotted asks for permission only after you choose an action. Sensitive species locations are not shown exactly on public maps.
        </AppText>
      </Card>

      <PermissionExplainer purposes={["camera", "photos", "location"]} />

      <View style={styles.actions}>
        <Button
          title="Take photo"
          icon={<Camera color={colors.white} size={18} />}
          onPress={() => handlePermissionIntent("camera")}
        />
        <Button
          title="Choose from library"
          variant="secondary"
          icon={<Image color={colors.forest} size={18} />}
          onPress={() => handlePermissionIntent("photos")}
        />
        <Button
          title="Log without photo"
          variant="secondary"
          icon={<MapPin color={colors.forest} size={18} />}
          onPress={() => handlePermissionIntent("location")}
        />
      </View>

      {lastResult ? (
        <Card muted>
          <AppText>{lastResult}</AppText>
        </Card>
      ) : null}

      <Card>
        <AppText variant="subheading">Submission not enabled yet</AppText>
        <AppText color="textMuted">
          This build does not save sightings. The next secure submission step must call the create_sighting RPC and must not write directly to the sightings table.
        </AppText>
      </Card>

      <PrivacyNotice message={wildlifeSafetyCopy.field} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.md,
  },
});
