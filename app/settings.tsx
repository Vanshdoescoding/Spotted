import { router } from "expo-router";

import { AppHeader } from "../src/components/layout/AppHeader";
import { PrivacyNotice } from "../src/components/sightings/PrivacyNotice";
import { Button } from "../src/components/ui/Button";
import { Card } from "../src/components/ui/Card";
import { Screen } from "../src/components/ui/Screen";
import { SectionHeader } from "../src/components/ui/SectionHeader";
import { AppText } from "../src/components/ui/Text";
import { APP_VERSION_LABEL } from "../src/constants/app";
import { useAuth } from "../src/features/auth/AuthProvider";

export default function SettingsScreen() {
  const auth = useAuth();

  return (
    <Screen>
      <AppHeader title="Settings" subtitle="Privacy, safety, and account foundations." />

      <SectionHeader title="Account" />
      <Card>
        <AppText variant="subheading">{auth.isAuthenticated ? "Account" : "Account optional"}</AppText>
        <AppText color="textMuted">
          Account deletion and export must be added before release if account creation is enabled.
        </AppText>
      </Card>

      <SectionHeader title="Privacy" />
      <Card>
        <AppText variant="subheading">Location protection</AppText>
        <AppText color="textMuted">
          Public sightings use approximate coordinates. Sensitive species can be blurred to broad areas or withheld from public maps.
        </AppText>
      </Card>

      <SectionHeader title="Wildlife safety" />
      <PrivacyNotice message="Avoid approaching, feeding, handling, or flushing wildlife for a better record." />

      <SectionHeader title="Support" />
      <Card>
        <AppText variant="subheading">Report a problem</AppText>
        <AppText color="textMuted">
          Reporting and moderation are planned. The backend foundation already includes sighting reports.
        </AppText>
      </Card>

      <Card>
        <AppText variant="caption" color="textMuted">
          App version: {APP_VERSION_LABEL}
        </AppText>
      </Card>

      <Button title="Permissions" variant="secondary" onPress={() => router.push("/permissions")} />
      {auth.isAuthenticated ? (
        <Button title="Sign out" variant="quiet" onPress={() => auth.signOut()} />
      ) : (
        <Button title="Sign in" variant="quiet" onPress={() => router.push("/sign-in")} />
      )}
    </Screen>
  );
}
