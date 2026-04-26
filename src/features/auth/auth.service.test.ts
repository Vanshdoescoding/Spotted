import { describe, expect, it } from "vitest";

import { getSafeUnauthenticatedState } from "./auth.service";

describe("auth service fallback", () => {
  it("returns a safe auth state without requiring Supabase config", () => {
    const state = getSafeUnauthenticatedState();

    expect(state.session).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.user?.id ?? null).not.toBe("");
  });
});

