import { router, useLocalSearchParams } from "expo-router";

import { AppHeader } from "../src/components/layout/AppHeader";
import { Button } from "../src/components/ui/Button";
import { Card } from "../src/components/ui/Card";
import { Screen } from "../src/components/ui/Screen";
import { AppText } from "../src/components/ui/Text";

export default function SignUpPendingScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const rawEmail = typeof params.email === "string" ? params.email : undefined;
  const email = rawEmail ? safeDecode(rawEmail) : undefined;

  return (
    <Screen>
      <AppHeader
        title="Check your email"
        subtitle="One last step to finish creating your account."
      />
      <Card>
        <AppText>
          We sent a confirmation link to {email ? email : "the address you signed up with"}.
        </AppText>
        <AppText color="textMuted">
          Open the email on this device and tap the link. It will open Spotted directly and finish setting up your account.
        </AppText>
        <AppText color="textMuted">
          If you don&apos;t see the email, check your spam folder.
        </AppText>
      </Card>
      <Button
        title="Back to sign in"
        variant="secondary"
        onPress={() => router.replace("/sign-in")}
      />
    </Screen>
  );
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}
