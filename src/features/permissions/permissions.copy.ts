import type { PermissionCopy, PermissionPurpose } from "./permissions.types";

export function getPermissionCopy(purpose: PermissionPurpose): PermissionCopy {
  switch (purpose) {
    case "camera":
      return {
        title: "Camera",
        body: "Used only when you choose to photograph wildlife evidence for a sighting.",
        deniedNextStep: "You can enable camera access later in iOS Settings.",
      };
    case "photos":
      return {
        title: "Photo library",
        body: "Used only when you choose an existing image. Spotted does not scan your library.",
        deniedNextStep: "You can choose limited photo access or enable access later in iOS Settings.",
      };
    case "location":
      return {
        title: "Location",
        body: "Used to place your sighting approximately. Sensitive species locations are blurred before public display.",
        deniedNextStep: "You can enable location access later in iOS Settings.",
      };
  }
}

