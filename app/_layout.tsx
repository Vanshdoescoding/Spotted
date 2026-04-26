import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "../src/features/auth/AuthProvider";
import { AppQueryProvider } from "../src/lib/query/QueryProvider";
import { colors } from "../src/lib/theme/colors";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppQueryProvider>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          />
        </AuthProvider>
      </AppQueryProvider>
    </SafeAreaProvider>
  );
}
