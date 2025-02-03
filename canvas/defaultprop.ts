import {
  Canvas,
  Control,
  Ellipse,
  EllipseProps,
  FabricObjectProps,
  Group,
  IText,
  ITextProps,
  Line,
  Polyline,
  Rect,
  RectProps,
} from "fabric";

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
      cornerStyle: "circle",
      cornerColor: "#5090ff",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 4,
      opacity: 1,
      transparentCorners: false,
      // strokeDashArray: [10, 10],
      ...obj,
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
      cornerStyle: "circle",
      cornerColor: "#5090ff",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 4,
      transparentCorners: false,
      ...obj,
    });
  }
}

class DefaultText extends IText {
  constructor(text: string, obj: Partial<ITextProps>) {
    super(text, {
      fill: "transparent",
      cornerStyle: "circle",
      cornerColor: "#5090ff",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 4,
      transparentCorners: false,
      textAlign: "left",
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
    this.padding = 6;
    this.stroke = "white"; // Set stroke color
    this.strokeWidth = 2; // Set stroke width
    this.selectable = true; // Make the line selectable
    this.hasControls = true; // Enable controls for resizing
    this.transparentCorners = false; // Make the corner points visible
    this.cornerStyle = "circle";
    this.cornerColor = "#5090ff";
    this.cornerStrokeColor = "#5090ff";
    this.cornerSize = 10;
    this.opacity = 1;

    this._createControls();
  }

  _createControls() {
    this.controls.start = new Control({
      render: (ctx) => {
        const start = this.get("aCoords");
        ctx.save();
        // Apply any transformations if necessary, such as scaling or rotation
        ctx.fillStyle = this.stroke ? (this.stroke as string) : "white";

        // Draw the arc (circle) at the start point
        ctx.beginPath();
        ctx.arc(start.tl.x, start.tl.y, 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
      },
    });
    this.controls.end = new Control({
      render: (ctx) => {
        const end = this.get("aCoords");
        ctx.save();
        // Apply any transformations if necessary, such as scaling or rotation
        ctx.fillStyle = this.stroke ? (this.stroke as string) : "white";

        // Draw the arc (circle) at the end point
        ctx.beginPath();
        ctx.arc(end.br.x, end.br.y, 5, 0, Math.PI * 2, false);
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
      cornerColor: "#5090ff",
      cornerStrokeColor: "#5090ff",
      cornerSize: 10,
      padding: 4,
      transparentCorners: false,
    });
  }
}

export {
  DefaultRect,
  DefaultPolygon,
  DefaultEllipse,
  DefaultText,
  DraggableLine,
};
