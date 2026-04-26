export type PermissionPurpose = "camera" | "photos" | "location";

export type AppPermissionStatus = "granted" | "denied" | "undetermined" | "limited";

export interface PermissionCopy {
  title: string;
  body: string;
  deniedNextStep: string;
}

