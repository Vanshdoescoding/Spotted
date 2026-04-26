import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { env } from "../config/env";

export const supabaseMaybe: SupabaseClient | null = createSupabaseClient();

function createSupabaseClient(): SupabaseClient | null {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
}

export function getSupabaseClient(): SupabaseClient {
  if (!supabaseMaybe) {
    throw new Error("Supabase is not configured. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return supabaseMaybe;
}

export const sightingWriteBoundary =
  "Future sighting creation must call the create_sighting RPC from the security migration. Do not write directly to public.sightings.";
