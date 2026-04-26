import { AppHeader } from "../src/components/layout/AppHeader";
import { Card } from "../src/components/ui/Card";
import { Screen } from "../src/components/ui/Screen";
import { AppText } from "../src/components/ui/Text";

export default function ForgotPasswordScreen() {
  return (
    <Screen>
      <AppHeader title="Forgot password" subtitle="Password recovery is not enabled in this foundation build." />
      <Card>
        <AppText color="textMuted">
          This route is reserved for Supabase password recovery. It should be wired before account-based beta testing.
        </AppText>
      </Card>
    </Screen>
  );
}

