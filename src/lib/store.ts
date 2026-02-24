"use client";

import { create } from "zustand";
import type { UserProfile, ScanHistoryItem } from "./types";

interface AppState {
  // Profile
  profile: UserProfile;
  setProfile: (profile: Partial<UserProfile>) => void;

  // History
  history: ScanHistoryItem[];
  addToHistory: (item: ScanHistoryItem) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Hydrated flag
  hydrated: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  ibsType: "Unsure",
  triggers: [],
  name: "",
};

export const useAppStore = create<AppState>((set, get) => ({
  profile: DEFAULT_PROFILE,
  setProfile: (partial) => {
    const newProfile = { ...get().profile, ...partial };
    set({ profile: newProfile });
    if (typeof window !== "undefined") {
      localStorage.setItem("gutlens-profile", JSON.stringify(newProfile));
    }
  },

  history: [],
  addToHistory: (item) => {
    const newHistory = [item, ...get().history];
    set({ history: newHistory });
    if (typeof window !== "undefined") {
      localStorage.setItem("gutlens-history", JSON.stringify(newHistory));
    }
  },
  removeFromHistory: (id) => {
    const newHistory = get().history.filter((h) => h.id !== id);
    set({ history: newHistory });
    if (typeof window !== "undefined") {
      localStorage.setItem("gutlens-history", JSON.stringify(newHistory));
    }
  },
  clearHistory: () => {
    set({ history: [] });
    if (typeof window !== "undefined") {
      localStorage.removeItem("gutlens-history");
    }
  },

  isDarkMode: false,
  toggleDarkMode: () => {
    const newVal = !get().isDarkMode;
    set({ isDarkMode: newVal });
    if (typeof window !== "undefined") {
      localStorage.setItem("gutlens-dark", JSON.stringify(newVal));
      document.documentElement.classList.toggle("dark", newVal);
    }
  },

  hydrated: false,
}));

export function hydrateStore() {
  if (typeof window === "undefined") return;

  try {
    const profileRaw = localStorage.getItem("gutlens-profile");
    const historyRaw = localStorage.getItem("gutlens-history");
    const darkRaw = localStorage.getItem("gutlens-dark");

    const profile = profileRaw ? JSON.parse(profileRaw) : DEFAULT_PROFILE;
    const history = historyRaw ? JSON.parse(historyRaw) : [];
    const isDarkMode = darkRaw ? JSON.parse(darkRaw) : false;

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    useAppStore.setState({ profile, history, isDarkMode, hydrated: true });
  } catch {
    useAppStore.setState({ hydrated: true });
  }
}
