import {
  Canvas,
  Circle,
  Control,
  Ellipse,
  EllipseProps,
  FabricObjectProps,
  FabricText,
  IText,
  Line,
  Rect,
} from "fabric";

class DefaultRect extends Rect {
  constructor(obj: Partial<FabricObjectProps>) {
    super({
      top: 20,
      left: 20,
      stroke: "white",
      strokeWidth: 4,
      rx: 5,
      ry: 5,
      fill: "transparent",
      cornerStyle: "circle",
      cornerColor: "#5090ff",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 2,
      transparentCorners: false,
      ...obj,
    });
    this.customControl();
  }

  customControl() {
    this.controls.duplicateControl = new Control({
      x: 0.2,
      y: -0.55,
      offsetY: -10,
      cursorStyle: "pointer",
      render: (ctx, left, top, _styleOverridem, fabricObject) => {
        const size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.strokeStyle = "white";
        ctx.rect(0, 0, 13, 13);
        ctx.stroke();
        ctx.restore();
      },
      mouseDownHandler: async (e: Event) => {
        const duplicate = await this.clone();
        if (!duplicate || !this.canvas) return;
        duplicate.set({ left: this.left + 10, top: this.top - 10 });
        this.canvas.add(duplicate);
        this.canvas.setActiveObject(duplicate);
      },
    });
  }
}

class DefaultEllipse extends Ellipse {
  constructor(obj: Partial<EllipseProps>) {
    super({
      originX: "center",
      originY: "center",
      stroke: "white",
      strokeWidth: 4,
      fill: "transparent",
      cornerStyle: "circle",
      cornerColor: "#5090ff",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 2,
      transparentCorners: false,
      ...obj,
    });
  }
}

class DefaultText extends IText {
  constructor(text: string, obj: Partial<FabricText>) {
    super(text, {
      cornerColor: "#5090ff",
      cornerStyle: "circle",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 2,
      ...obj,
    });
  }
}

class DraggableLine extends Line {
  constructor(
    points: [number, number, number, number],
    options: Partial<FabricObjectProps>
  ) {
    super(points, options);
    this.hasControls = true;
    this.lockScalingX = true;
    this.lockScalingY = true;
    this._createControls();
  }

  _createControls() {
    this.controls.start = new Control({
      x: -0.5,
      y: -0.5,
    });
  }
}

export { DefaultRect, DefaultEllipse, DefaultText };
