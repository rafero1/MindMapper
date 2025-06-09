import { create } from "zustand";

interface Settings {
  zoomLevel: number;
  gridEnabled: boolean;
}

interface SettingsState {
  settings: Settings;
  setZoomLevel: (value: number) => void;
  setGridEnabled: (value: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: {
    zoomLevel: 1,
    gridEnabled: true,
  },
  setZoomLevel: (value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        zoomLevel: value,
      },
    })),
  setGridEnabled: (value) =>
    set((state) => ({
      settings: {
        ...state.settings,
        gridEnabled: value,
      },
    })),
}));
