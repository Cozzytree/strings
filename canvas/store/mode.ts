import { canvasConfig } from "canvas/config";
import { Mode } from "canvas/types";
import { create } from "zustand";

interface modeInterface {
  mode: Mode;

  setMode: (m: Mode) => void;
}

const useMode = create<modeInterface>((set) => ({
  mode: canvasConfig.mode,
  setMode: (m) => set({ mode: m }),
}));

export { useMode };
