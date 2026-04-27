import { router } from "expo-router";
import { Settings } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

import { AppHeader } from "../../src/components/layout/AppHeader";
import { Button } from "../../src/components/ui/Button";
import { Card } from "../../src/components/ui/Card";
import { Screen } from "../../src/components/ui/Screen";
import { SectionHeader } from "../../src/components/ui/SectionHeader";
import { AppText } from "../../src/components/ui/Text";
import { useAuth } from "../../src/features/auth/AuthProvider";
import { useMockUser } from "../../src/hooks/useMockUser";
import { env } from "../../src/lib/config/env";
import { colors } from "../../src/lib/theme/colors";
import { spacing } from "../../src/lib/theme/spacing";

export default function ProfileScreen() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return (
      <Screen>
        <AppHeader title="Profile" subtitle="Public browsing is available without an account." />
        <Card>
          <AppText variant="subheading">Sign in to save your collection</AppText>
          <AppText color="textMuted">
            An account will let Spotted sync your collection and track your sightings across devices. Public map browsing stays open.
          </AppText>
        </Card>
        <Button title="Sign in" onPress={() => router.push("/sign-in")} />
        <Button title="Create account" variant="secondary" onPress={() => router.push("/sign-up")} />
      </Screen>
    );
  }

  if (env.useMockData) {
    return <MockProfile />;
  }

  return <RealProfile />;
}

function MockProfile() {
  const user = useMockUser();
  const auth = useAuth();

  return (
    <Screen>
      <AppHeader title={auth.user?.displayName ?? user.displayName} subtitle={user.homeRegion} />
      <View style={styles.stats}>
        <ProfileStat label="Conservation score" value={user.conservationScore.toString()} />
        <ProfileStat label="Sightings" value={user.sightingCount.toString()} />
        <ProfileStat label="Collection" value={user.collectionCount.toString()} />
        <ProfileStat label="Verified" value={user.verifiedSightingsCount.toString()} />
      </View>

      <SectionHeader title="Account" />
      <Card>
        <AppText variant="subheading">Development profile</AppText>
        <AppText color="textMuted">
          Profile metrics are still mock data. Authentication is ready as a foundation, but collection sync is not live yet.
        </AppText>
      </Card>

      <Button
        title="Settings"
        variant="secondary"
        icon={<Settings color={colors.forest} size={18} />}
        onPress={() => router.push("/settings")}
      />
      <Button title="Safety and permissions" variant="quiet" onPress={() => router.push("/permissions")} />
    </Screen>
  );
}

function RealProfile() {
  const auth = useAuth();
  const headerTitle = auth.user?.displayName ?? auth.user?.email ?? "Profile";
  const headerSubtitle = auth.user?.displayName && auth.user?.email ? auth.user.email : undefined;

  return (
    <Screen>
      <AppHeader
        title={headerTitle}
        {...(headerSubtitle ? { subtitle: headerSubtitle } : {})}
      />

      <SectionHeader title="Your activity" />
      <Card>
        <AppText variant="subheading">No sightings yet</AppText>
        <AppText color="textMuted">
          Once sighting submission is enabled, your recent sightings will appear here.
        </AppText>
      </Card>
      <Card>
        <AppText variant="subheading">Start your collection</AppText>
        <AppText color="textMuted">
          Species you record will fill out your collection card by card.
        </AppText>
      </Card>

      <SectionHeader title="Account" />
      <Card>
        <AppText variant="subheading">Signed in</AppText>
        <AppText color="textMuted">
          Sighting history and collection sync will be wired in a later iteration.
        </AppText>
      </Card>

      <Button
        title="Settings"
        variant="secondary"
        icon={<Settings color={colors.forest} size={18} />}
        onPress={() => router.push("/settings")}
      />
      <Button title="Safety and permissions" variant="quiet" onPress={() => router.push("/permissions")} />
    </Screen>
  );
}

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.statCard}>
      <AppText variant="heading">{value}</AppText>
      <AppText variant="caption" color="textMuted">
        {label}
      </AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statCard: {
    flexBasis: "47%",
    flexGrow: 1,
  },
});
