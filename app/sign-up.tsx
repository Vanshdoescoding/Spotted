import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { AppHeader } from "../src/components/layout/AppHeader";
import { Button } from "../src/components/ui/Button";
import { Card } from "../src/components/ui/Card";
import { Screen } from "../src/components/ui/Screen";
import { AppText } from "../src/components/ui/Text";
import { useAuth } from "../src/features/auth/AuthProvider";
import { colors } from "../src/lib/theme/colors";
import { radius, spacing } from "../src/lib/theme/spacing";

export default function SignUpScreen() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSignUp() {
    const result = await auth.signUpWithEmail(email, password);
    setMessage(result.message ?? (result.ok ? "Account request submitted." : "Sign up could not be completed."));
    if (result.ok) {
      router.back();
    }
  }

  return (
    <Screen>
      <AppHeader title="Create account" subtitle="Accounts will support saved collections and sighting history." />
      <Card>
        <View style={styles.form}>
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            value={email}
          />
          <TextInput
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.textMuted}
            secureTextEntry
            style={styles.input}
            value={password}
          />
          <Button title="Create account" onPress={handleSignUp} />
        </View>
      </Card>
      <AppText color="textMuted">
        Account deletion and export flows must be completed before public release.
      </AppText>
      {message ? <AppText color="textMuted">{message}</AppText> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.md,
  },
  input: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.text,
    minHeight: 48,
    paddingHorizontal: spacing.md,
  },
});

