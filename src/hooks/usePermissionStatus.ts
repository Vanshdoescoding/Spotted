import { useEffect, useState } from "react";

import {
  getPermissionStatus,
  requestPermission,
} from "../features/permissions/permissions.service";
import type {
  AppPermissionStatus,
  PermissionPurpose,
} from "../features/permissions/permissions.types";

export function usePermissionStatus(purpose: PermissionPurpose) {
  const [status, setStatus] = useState<AppPermissionStatus>("undetermined");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getPermissionStatus(purpose)
      .then((nextStatus) => {
        if (isMounted) {
          setStatus(nextStatus);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [purpose]);

  async function request() {
    const nextStatus = await requestPermission(purpose);
    setStatus(nextStatus);
    return nextStatus;
  }

  return { status, isLoading, request };
}

