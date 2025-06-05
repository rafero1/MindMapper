import { create } from "zustand";

interface SettingsState {
  zoomLevel: number;
  setZoomLevel: (value: number) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  zoomLevel: 1,
  setZoomLevel: (value) =>
    set(() => ({
      zoomLevel: value,
    })),
}));
