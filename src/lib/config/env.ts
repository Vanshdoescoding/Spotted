import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  EXPO_PUBLIC_USE_MOCK_DATA: z.string().optional(),
});

const rawEnv = envSchema.parse({
  EXPO_PUBLIC_SUPABASE_URL: emptyToUndefined(process.env.EXPO_PUBLIC_SUPABASE_URL),
  EXPO_PUBLIC_SUPABASE_ANON_KEY: emptyToUndefined(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  EXPO_PUBLIC_USE_MOCK_DATA: emptyToUndefined(process.env.EXPO_PUBLIC_USE_MOCK_DATA),
});

export const env = {
  supabaseUrl: rawEnv.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: rawEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  useMockData: parseMockFlag(rawEnv.EXPO_PUBLIC_USE_MOCK_DATA),
  isSupabaseConfigured: Boolean(
    rawEnv.EXPO_PUBLIC_SUPABASE_URL && rawEnv.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  ),
  isDevelopment: typeof __DEV__ !== "undefined" ? __DEV__ : false,
} as const;

export function hasSupabaseConfig(): boolean {
  return env.isSupabaseConfigured;
}

function emptyToUndefined(value: string | undefined): string | undefined {
  return value && value.trim().length > 0 ? value : undefined;
}

function parseMockFlag(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return value.toLowerCase() === "true";
}
