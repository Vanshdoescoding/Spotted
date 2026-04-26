import type { Session } from "@supabase/supabase-js";

export interface AuthUser {
  id: string;
  email?: string;
  displayName?: string;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthActionResult {
  ok: boolean;
  message?: string;
}

