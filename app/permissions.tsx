import { PermissionExplainer } from "../src/components/permissions/PermissionExplainer";
import { AppHeader } from "../src/components/layout/AppHeader";
import { PrivacyNotice } from "../src/components/sightings/PrivacyNotice";
import { Screen } from "../src/components/ui/Screen";
import { AppText } from "../src/components/ui/Text";

export default function PermissionsScreen() {
  return (
    <Screen>
      <AppHeader
        title="Permissions"
        subtitle="Spotted asks only when a permission supports an action you choose."
      />
      <PermissionExplainer purposes={["camera", "photos", "location"]} />
      <PrivacyNotice message="Exact sensitive locations are not displayed publicly, even when location helps record a sighting." />
      <AppText color="textMuted">
        If access is denied, iOS Settings remains the right place to change it. Spotted should not repeatedly prompt after a clear no.
      </AppText>
    </Screen>
  );
}

