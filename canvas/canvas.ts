import * as fabric from "fabric";
import { Mode } from "./types";
import { DefaultRect } from "./defaultprop";

interface canvasInterface {
  canvas: fabric.Canvas;
  mode: Mode;
  callback: () => void;
}

class Canvas {
  mousedownPoint = { x: 0, y: 0 };
  newShape: fabric.Object | null = null;
  callback: () => void;
  canvas: fabric.Canvas;
  mode: Mode;

  constructor({ canvas, mode, callback }: canvasInterface) {
    this.canvas = canvas;
    this.mode = mode;
    this.callback = callback;
  }

  add(shape: fabric.Object) {
    this.canvas.add(shape);
    this.canvas.renderAll();
  }

  mousedown() {
    this.canvas.on("mouse:down", (e) => {
      console.log(e);
      const { x, y } = e.viewportPoint;

      if (this.mode === "rect") {
        this.canvas.selection = false;

        this.newShape = new DefaultRect({
          top: y,
          left: x,
          width: 0,
          height: 0,
        });
        this.add(this.newShape);
        console.log(this.newShape);
      }

      this.mousedownPoint = { x, y };
    });
  }

  mouseMove() {
    this.canvas.on("mouse:move", (e) => {
      if (this.newShape) {
        // const { x, y } = e.viewportPoint;
        const { x, y } = this.canvas.getViewportPoint(e.e);
        if (this.mode === "rect") {
          this.newShape.set({
            width: x - this.mousedownPoint.x,
            height: y - this.mousedownPoint.y,
          });
          this.canvas.renderAll();
        }
      }
    });
  }

  mouseUp() {
    this.canvas.on("mouse:up", (e) => {
      this.canvas.selection = true;
      if (this.newShape) {
        this.canvas.add(this.newShape);
      
        // Select the newly created shape
        this.canvas.setActiveObject(this.newShape);
        this.canvas.renderAll();
      }

      this.newShape = null;
      this.callback();
    });
  }

  init() {
    this.mousedown();
    this.mouseMove();
    this.mouseUp();
  }

  clear() {
    this.canvas.removeListeners();
    this.canvas.dispose();
  }
}

export default Canvas;
