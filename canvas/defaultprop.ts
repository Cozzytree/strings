import { FabricObjectProps, Rect } from "fabric";

class DefaultRect extends Rect {
  constructor(obj: Partial<FabricObjectProps>) {
    super({
      width: 100,
      height: 100,
      top: 20,
      left: 20,
      stroke: "white",
      strokeWidth: 4,
      rx: 5,
      ry: 5,
      cornerColor: "#5090ff",
      cornerStrokeColor: "#5090ff",
      fill: "transparent",
      cornerSize: 8,
      padding: 2,
      ...obj,
    });
  }
}

export { DefaultRect };
