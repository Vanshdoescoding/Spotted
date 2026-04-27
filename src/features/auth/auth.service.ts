import type { Session, User } from "@supabase/supabase-js";

import { env } from "../../lib/config/env";
import { supabaseMaybe } from "../../lib/supabase/client";
import { mockUserProfile } from "../profile/profile.mock";
import type { AuthActionResult, AuthState, AuthUser } from "./auth.types";

export function getSafeUnauthenticatedState(): AuthState {
  const mockAuthActive = env.useMockData && env.isDevelopment;
  return {
    user: mockAuthActive ? mapMockUser() : null,
    session: null,
    isLoading: false,
    isAuthenticated: mockAuthActive,
  };
}

export async function getCurrentAuthState(): Promise<AuthState> {
  if ((env.useMockData && env.isDevelopment) || !supabaseMaybe) {
    return getSafeUnauthenticatedState();
  }

  const { data, error } = await supabaseMaybe.auth.getSession();

  if (error || !data.session) {
    return getSafeUnauthenticatedState();
  }

  return mapSessionToAuthState(data.session);
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  if (env.useMockData && env.isDevelopment) {
    return { ok: true, message: "Mock sign in is active for local development." };
  }

  if (!supabaseMaybe) {
    return { ok: false, message: "Supabase is not configured for sign in." };
  }

  const { error } = await supabaseMaybe.auth.signInWithPassword({ email, password });
  return error ? { ok: false, message: error.message } : { ok: true };
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<AuthActionResult> {
  if (env.useMockData && env.isDevelopment) {
    return { ok: true, message: "Mock sign up is active for local development." };
  }

  if (!supabaseMaybe) {
    return { ok: false, message: "Supabase is not configured for sign up." };
  }

  const { error } = await supabaseMaybe.auth.signUp({ email, password });
  return error ? { ok: false, message: error.message } : { ok: true };
}

export async function signOut(): Promise<AuthActionResult> {
  if (env.useMockData && env.isDevelopment) {
    return { ok: true };
  }

  if (!supabaseMaybe) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { error } = await supabaseMaybe.auth.signOut();
  return error ? { ok: false, message: error.message } : { ok: true };
}

export async function exchangeAuthCode(code: string): Promise<AuthActionResult> {
  if (env.useMockData && env.isDevelopment) {
    return { ok: true, message: "Mock confirmation accepted for local development." };
  }

  if (!supabaseMaybe) {
    return { ok: false, message: "Supabase is not configured." };
  }

  const { error } = await supabaseMaybe.auth.exchangeCodeForSession(code);

  if (error) {
    return {
      ok: false,
      message:
        "That confirmation link couldn't be used. It may have expired or already been used.",
    };
  }

  return { ok: true };
}

export function mapSessionToAuthState(session: Session): AuthState {
  return {
    user: mapSupabaseUser(session.user),
    session,
    isLoading: false,
    isAuthenticated: true,
  };
}

export function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    ...(user.email ? { email: user.email } : {}),
    ...(typeof user.user_metadata.name === "string"
      ? { displayName: user.user_metadata.name }
      : {}),
  };
}

function mapMockUser(): AuthUser {
  return {
    id: mockUserProfile.id,
    displayName: mockUserProfile.displayName,
  };
}

