import * as fabric from "fabric";
import { Mode } from "./types";
import { DefaultEllipse, DefaultRect, DefaultText } from "./defaultprop";

interface canvasInterface {
  canvas: fabric.Canvas;
  mode: Mode;
  callback: () => void;
  setActiveObj: (v: fabric.FabricObject[] | []) => void;
}

class Canvas {
  mousedownPoint = { x: 0, y: 0 };
  newShape: fabric.Object | null = null;
  callback: () => void;
  setActiveObj: (v: fabric.FabricObject[] | []) => void;
  canvas: fabric.Canvas;
  mode: Mode;

  constructor({ canvas, mode, callback, setActiveObj }: canvasInterface) {
    this.canvas = canvas;
    this.mode = mode;
    this.callback = callback;
    this.setActiveObj = setActiveObj;
  }

  _setActive() {
    const active = this.canvas.getActiveObjects();
    if (active.length) {
      this.setActiveObj(active);
    } else {
      this.setActiveObj([]);
    }
  }

  add(shape: fabric.Object) {
    this.canvas.add(shape);
    this.canvas.renderAll();
  }

  changeMode(mode: Mode) {
    this.mode = mode;
  }

  setDrawBrush() {
    this.canvas.isDrawingMode = true;

    const brush = new fabric.PencilBrush(this.canvas);
    brush.width = 10;
    brush.color = "green";

    this.canvas.freeDrawingBrush = brush;
  }

  mousedown() {
    this.canvas.on("mouse:down", (e) => {
      const { x, y } = e.scenePoint;

      this.mousedownPoint = { x, y };

      if (this.mode !== "default" && this.mode !== "draw") {
        this.canvas.selection = false;
        switch (this.mode) {
          case "rect":
            this.newShape = new DefaultRect({
              top: y,
              left: x,
              width: 0,
              height: 0,
              strokeDashOffset : 2
            });
            break;
          case "ellipse":
            this.newShape = new DefaultEllipse({
              rx: 0,
              ry: 0,
              top: y,
              left: x,
              width: 0,
              height: 0,
            });
            break;
          case "line":
            this.newShape = new fabric.Line([x, y, x, y], {
              stroke: "white", // Set stroke color
              strokeWidth: 2, // Set stroke width
              selectable: true, // Make the line selectable
              hasControls: true, // Enable controls for resizing
              cornerSize: 12, // Customize control point size
              transparentCorners: false, // Make the corner points visible
            });
            break;
          case "text":
            let text = new DefaultText("", {
              top: y,
              left: x,
              fill: "white",
              stroke: "white",
              fontFamily: "Arial",
            });
            text.enterEditing();
            this.newShape = text;
            break;
        }
        if (this.newShape) this.add(this.newShape);
        return;
      }

      this._setActive();
    });
  }

  mouseMove() {
    this.canvas.on("mouse:move", (e) => {
      if (this.newShape) {
        // const { x, y } = e.viewportPoint;
        const { x, y } = e.scenePoint;

        if (this.mode === "rect") {
          this.newShape.set({
            width: x - this.mousedownPoint.x,
            height: y - this.mousedownPoint.y,
          });
        } else if (this.mode === "ellipse") {
          this.newShape.set({
            rx: Math.abs(x - this.mousedownPoint.x),
            ry: Math.abs(y - this.mousedownPoint.y),
          });
        } else if (this.mode === "line") {
          this.newShape.set({
            x2: x, // Update x2 to the mouse x position
            y2: y, // Update y2 to the mouse y position
          });
        }
        this.canvas.renderCanvas(
          this.canvas.getContext(),
          this.canvas.getObjects()
        );
      }
    });
  }

  mouseUp() {
    this.canvas.on("mouse:up", (e) => {
      if (this.mode === "draw") return;
      this.canvas.selection = true;
      if (this.newShape) {
        // Select the newly created shape
        this.canvas.setActiveObject(this.newShape);
        this.canvas.renderAll();
      }

      this.newShape = null;
      this.callback();
      this._setActive();
    });
  }

  windowResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.renderAll();
  }

  scroll() {
    this.canvas.on("mouse:wheel", (e) => {
      console.log(e);
      const delta = e.e.deltaY; // Get the wheel delta (positive for scroll down, negative for scroll up)

      // Get the current transform (viewport transform)
      const currentTransform = this.canvas.viewportTransform;

      // Set the pan amount (adjust this value to control the panning speed)
      const panAmount = 20;

      if (delta > 0) {
        // Scroll down (move the canvas up)
        currentTransform[5] -= panAmount; // Change the vertical offset (y-axis)
      } else {
        // Scroll up (move the canvas down)
        currentTransform[5] += panAmount; // Change the vertical offset (y-axis)
      }

      // Apply the new transform
      this.canvas.viewportTransform = currentTransform;

      // Prevent the default scroll behavior (e.g., page scrolling)
      this.canvas.renderAll();
      e.e.preventDefault();
      e.e.stopPropagation();
    });
  }

  init() {
    this.mousedown();
    this.mouseMove();
    this.mouseUp();
    this.scroll();
    window.addEventListener("resize", this.windowResize.bind(this));
  }

  clear() {
    this.canvas.removeListeners();
    this.canvas.dispose();
    window.removeEventListener("resize", this.windowResize);
  }
}

export default Canvas;
