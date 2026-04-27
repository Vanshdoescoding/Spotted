import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import { AppHeader } from "../../src/components/layout/AppHeader";
import { Button } from "../../src/components/ui/Button";
import { ErrorState } from "../../src/components/ui/ErrorState";
import { LoadingState } from "../../src/components/ui/LoadingState";
import { Screen } from "../../src/components/ui/Screen";
import { exchangeAuthCode } from "../../src/features/auth/auth.service";

type Status = "exchanging" | "missing" | "error";

export default function AuthCallbackScreen() {
  const params = useLocalSearchParams<{ code?: string; type?: string }>();
  const code = typeof params.code === "string" ? params.code : undefined;
  const type = typeof params.type === "string" ? params.type : undefined;

  const [status, setStatus] = useState<Status>(code ? "exchanging" : "missing");
  const [errorMessage, setErrorMessage] = useState<string>(
    "That confirmation link couldn't be used. It may have expired or already been used.",
  );

  useEffect(() => {
    if (!code) {
      return;
    }

    let cancelled = false;

    void exchangeAuthCode(code).then((result) => {
      if (cancelled) {
        return;
      }

      if (!result.ok) {
        if (result.message) {
          setErrorMessage(result.message);
        }
        setStatus("error");
        return;
      }

      // AuthProvider's onAuthStateChange listener picks up the new session.
      if (type === "recovery") {
        // TODO: route to a dedicated password-reset screen once that flow
        // is built. For now, drop the user on home with the active session.
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(tabs)/home");
      }
    });

    return () => {
      cancelled = true;
    };
  }, [code, type]);

  if (status === "exchanging") {
    return (
      <Screen>
        <LoadingState label="Confirming your account" />
      </Screen>
    );
  }

  const headerSubtitle =
    status === "missing"
      ? "This link is missing the confirmation code."
      : "Spotted couldn't confirm this link.";

  const bodyMessage =
    status === "missing"
      ? "Open the most recent confirmation email on this device and tap the link again."
      : errorMessage;

  return (
    <Screen>
      <AppHeader title="Confirmation" subtitle={headerSubtitle} />
      <ErrorState message={bodyMessage} />
      <Button
        title="Back to sign in"
        variant="secondary"
        onPress={() => router.replace("/sign-in")}
      />
    </Screen>
  );
}
