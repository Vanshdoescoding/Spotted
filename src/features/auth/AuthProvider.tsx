import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { env } from "../../lib/config/env";
import { supabaseMaybe } from "../../lib/supabase/client";
import {
  getCurrentAuthState,
  getSafeUnauthenticatedState,
  mapSessionToAuthState,
  signInWithEmail as signInWithEmailService,
  signOut as signOutService,
  signUpWithEmail as signUpWithEmailService,
} from "./auth.service";
import type { AuthActionResult, AuthState } from "./auth.types";

interface AuthContextValue extends AuthState {
  signInWithEmail: (email: string, password: string) => Promise<AuthActionResult>;
  signUpWithEmail: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<AuthActionResult>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let isMounted = true;

    getCurrentAuthState().then((nextState) => {
      if (isMounted) {
        setState(nextState);
      }
    });

    if ((env.useMockData && env.isDevelopment) || !supabaseMaybe) {
      return () => {
        isMounted = false;
      };
    }

    const { data } = supabaseMaybe.auth.onAuthStateChange((_event, session) => {
      setState(session ? mapSessionToAuthState(session) : getSafeUnauthenticatedState());
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signInWithEmail: async (email, password) => {
        const result = await signInWithEmailService(email, password);
        if (env.useMockData && env.isDevelopment && result.ok) {
          setState(getSafeUnauthenticatedState());
        }
        return result;
      },
      signUpWithEmail: async (email, password) => {
        const result = await signUpWithEmailService(email, password);
        if (env.useMockData && env.isDevelopment && result.ok) {
          setState(getSafeUnauthenticatedState());
        }
        return result;
      },
      signOut: async () => {
        const result = await signOutService();
        if (result.ok) {
          setState(getSafeUnauthenticatedState());
        }
        return result;
      },
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
