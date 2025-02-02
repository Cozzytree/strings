import { Mode } from "./types";

const canvasConfig: { mode: Mode } = {
  mode: "default",
};

const basicColors = ["#101010", "#ef4040", "#20ff50", "#2050ef", "#9a9a10"];
const colors = ["#00000000", ...basicColors];
const strokeStyles: [number, number][] = [
  [0, 0],
  [10, 10],
  [5, 5],
];
const widths = [2, 4, 6];

export { canvasConfig, basicColors, colors, strokeStyles, widths };
