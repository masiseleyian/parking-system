"use client";

import { useCallback, useEffect, useState } from "react";
import { emptySnapshot, localParkingStore, PARKING_UPDATED_EVENT, type ParkingSnapshot } from "@/lib/parking-store";

export function useParking() {
  const [snapshot, setSnapshot] = useState<ParkingSnapshot>(emptySnapshot);
  const refresh = useCallback(() => {
    void localParkingStore.read().then(setSnapshot).catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 2000);
    window.addEventListener("storage", refresh);
    window.addEventListener(PARKING_UPDATED_EVENT, refresh);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(PARKING_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  return { ...snapshot, refresh };
}
