import { create } from "zustand";

interface Settings {
  zoomLevel: number;
  gridEnabled: boolean;
}

interface SettingsState {
  settings: Settings;
  setZoomLevel: (value: number) => void;
  toggleGrid: () => void;
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
  toggleGrid: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        gridEnabled: !state.settings.gridEnabled,
      },
    })),
}));
