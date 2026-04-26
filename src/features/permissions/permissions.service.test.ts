import { describe, expect, it } from "vitest";

import { getPermissionCopy } from "./permissions.copy";

describe("permission copy", () => {
  it("explains location use without implying exact public sharing", () => {
    const copy = getPermissionCopy("location");

    expect(copy.body).toContain("approximately");
    expect(copy.body).toContain("blurred");
  });

  it("explains that photo library access is user-selected", () => {
    const copy = getPermissionCopy("photos");

    expect(copy.body).toContain("choose");
    expect(copy.body).toContain("does not scan");
  });
});
