import { FabricObject } from "fabric";
import { create } from "zustand";

type objTypes = "i-text" | "rect" | "ellipse" | "path" | "line";
export type alphas = 0.1 | 0.25 | 0.5 | 0.75 | 1 | "ff";

interface activeInterface {
  obj: FabricObject[] | [];
  currentColorAlpha: alphas;

  setCurrentColorAlpha: (v: alphas) => void;
  setActiveObj: (v: FabricObject[] | []) => void;
}
const useActiveObject = create<activeInterface>((set) => ({
  obj: [],
  currentColorAlpha: 0.5 as alphas,

  setCurrentColorAlpha: (v) => {
    if (v === 1) {
      set({ currentColorAlpha: "ff" });
    } else {
      set({ currentColorAlpha: v });
    }
  },
  setActiveObj: (v) => set({ obj: v }),
}));

export { useActiveObject };
