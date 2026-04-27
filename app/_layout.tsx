import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AuthProvider } from "../src/features/auth/AuthProvider";
import { env } from "../src/lib/config/env";
import { AppQueryProvider } from "../src/lib/query/QueryProvider";
import { colors } from "../src/lib/theme/colors";

if (env.useMockData && !env.isDevelopment) {
  throw new Error(
    "Production build cannot enable mock data. Set EXPO_PUBLIC_USE_MOCK_DATA=false.",
  );
}

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
