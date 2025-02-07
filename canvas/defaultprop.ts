import {
  Control,
  Ellipse,
  EllipseProps,
  FabricObjectProps,
  IText,
  ITextProps,
  Line,
  Polyline,
  Rect,
  RectProps,
  Triangle,
} from "fabric";

const defaultActiveSelectionStyle: Partial<FabricObjectProps> = {
  cornerStyle: "circle",
  cornerSize: 10,
  transparentCorners: false,
  borderDashArray: [3],
  cornerColor: "transparent",
  cornerStrokeColor: "#5090ff",
  padding: 2,
}

class DefaultRect extends Rect {
  constructor(obj: Partial<RectProps>) {
    super({
      top: 20,
      left: 20,
      stroke: "white",
      strokeWidth: 4,
      rx: 5,
      ry: 5,
      // centeredScaling: true,
      fill: "transparent",
      cornerColor: "transparent",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 2,
      opacity: 1,
      transparentCorners: false,
      strokeUniform: true,
      objectCaching: true,
      // strokeDashArray: [10, 10],
      ...obj,
    });
    this.set({ id: `shape:${String(Date.now())}` });
    this.on("mousedown", (e) => {
    });
    // this.customControl();
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
      cornerColor: "transparent",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 2,
      transparentCorners: false,
      strokeUniform: true,
      objectCaching: true,
      centeredRotation: true,
      ...obj,
    });
    this.set({ id: `shape:${String(Date.now())}` });
  }
}

class DefaultText extends IText {
  constructor(text: string, obj: Partial<ITextProps>) {
    super(text, {
      padding: 4,
      fontSize: 15,
      cornerSize: 10,
      fontWeight: 300,
      textAlign: "left",
      fill: "transparent",
      cornerStyle: "circle",
      cornerColor: "transparent",
      transparentCorners: false,
      cornerStrokeColor: "#5090ff",
      strokeUniform: true,
      ...obj,
    });
    this.set({ id: `shape:${String(Date.now())}` });
  }
}

class DraggableLine extends Line {
  constructor(
    points: [number, number, number, number],
    options: Partial<FabricObjectProps>
  ) {
    super(points, options);
    this.hasControls = true;
    this.padding = 2;
    this.stroke = "white"; // Set stroke color
    this.strokeWidth = 2; // Set stroke width
    this.selectable = true; // Make the line selectable
    this.hasControls = true; // Enable controls for resizing
    this.transparentCorners = false; // Make the corner points visible
    this.cornerColor = "transparent";
    this.cornerStrokeColor = "#5090ff";
    this.cornerSize = 10;
    this.opacity = 1;
    this.hasControls = true;
    this.strokeUniform = true;
    this.set({ id: `shape:${String(Date.now())}` });
    this._createControls();
  }

  _createControls() {
    this.controls.start = new Control({
      mouseDownHandler: (e) => {
        console.log(e);
      },
      actionHandler: (e, t, x, y) => {
        console.log(e);
        return true;
      },
      render: (ctx, left, top, _, obj) => {
        ctx.save();
        // Apply any transformations if necessary, such as scaling or rotation
        ctx.fillStyle = this.stroke ? (this.stroke as string) : "white";

        // Draw the arc (circle) at the start point
        ctx.beginPath();

        ctx.arc(left, top, 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      },
    });
    this.controls.end = new Control({
      render: (ctx) => {
        ctx.save();
        // Apply any transformations if necessary, such as scaling or rotation
        ctx.fillStyle = this.stroke ? (this.stroke as string) : "white";

        // Draw the arc (circle) at the end point
        ctx.beginPath();
        ctx.arc(this.x2, this.y2, 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      },
    });
  }
}

class DefaultPolygon extends Polyline {
  constructor(
    points: { x: number; y: number }[],
    props: Partial<FabricObjectProps>
  ) {
    super(points, {
      ...props,
      cornerStyle: "circle",
      cornerColor: "transparent",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 4,
      transparentCorners: false,
    });
    this.set({ id: `shape:${String(Date.now())}` });
  }
}

class DefaultTriangle extends Triangle {
  constructor(props: Partial<FabricObjectProps>) {
    super({
      cornerColor: "transparent",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 2,
      transparentCorners: false,
      strokeUniform: true,
      ...props,
    });
    this.set({ id: `shape:${String(Date.now())}` });
  }
}

export {
  DefaultRect,
  DefaultPolygon,
  DefaultEllipse,
  DefaultText,
  DefaultTriangle,
  DraggableLine,
  defaultActiveSelectionStyle,
};
