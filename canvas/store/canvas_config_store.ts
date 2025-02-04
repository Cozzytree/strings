import { create } from "zustand";

interface canvasInterface {
  backgroundColor: string;

  handleBackgroundColor: (c: string) => void;
}

const useCanvasStore = create<canvasInterface>((set) => {
  return {
    backgroundColor: "#202020",
    handleBackgroundColor: (v) => {
      localStorage.setItem("canvas-bg", v)
      set({ backgroundColor: v })
    },
  };
});

export { useCanvasStore };
