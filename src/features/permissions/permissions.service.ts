import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Linking } from "react-native";

import type { AppPermissionStatus, PermissionPurpose } from "./permissions.types";

export { getPermissionCopy } from "./permissions.copy";

export async function getPermissionStatus(purpose: PermissionPurpose): Promise<AppPermissionStatus> {
  switch (purpose) {
    case "camera": {
      const response = await Camera.getCameraPermissionsAsync();
      return normalizeStatus(response.status);
    }
    case "photos": {
      const response = await ImagePicker.getMediaLibraryPermissionsAsync();
      return response.accessPrivileges === "limited" ? "limited" : normalizeStatus(response.status);
    }
    case "location": {
      const response = await Location.getForegroundPermissionsAsync();
      return normalizeStatus(response.status);
    }
  }
}

export async function requestPermission(purpose: PermissionPurpose): Promise<AppPermissionStatus> {
  switch (purpose) {
    case "camera": {
      const response = await Camera.requestCameraPermissionsAsync();
      return normalizeStatus(response.status);
    }
    case "photos": {
      const response = await ImagePicker.requestMediaLibraryPermissionsAsync(false);
      return response.accessPrivileges === "limited" ? "limited" : normalizeStatus(response.status);
    }
    case "location": {
      const response = await Location.requestForegroundPermissionsAsync();
      return normalizeStatus(response.status);
    }
  }
}

export async function openAppPermissionSettings(): Promise<void> {
  await Linking.openSettings();
}

function normalizeStatus(status: string): AppPermissionStatus {
  if (status === "granted" || status === "denied") {
    return status;
  }

  return "undetermined";
}
