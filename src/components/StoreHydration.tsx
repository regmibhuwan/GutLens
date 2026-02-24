"use client";

import { useEffect } from "react";
import { hydrateStore } from "@/lib/store";

export function StoreHydration() {
  useEffect(() => {
    hydrateStore();
  }, []);
  return null;
}
