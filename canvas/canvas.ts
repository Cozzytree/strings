import * as fabric from "fabric";
import { BrushType, canvasMode, Mode } from "./types";
import {
   DefaultRect,
   DefaultText,
   DraggableLine,
   DefaultEllipse,
   DefaultTriangle,
   defaultActiveSelectionStyle,
   DefaultCircle,
} from "./defaultprop";
import { Redo, Undo } from "./store/stack";

interface canvasInterface {
   mode: Mode;
   curr_fill: string;
   curr_stroke: string;
   canvas: fabric.Canvas;
   brush_stroke_color: string;

   onNewObjewct: (obj: fabric.FabricObject) => void;
   setActiveObj: (v: fabric.FabricObject[] | []) => void;
   callback: (v: { mode: Mode; objs: fabric.FabricObject[] | [] }) => void;
}

class Canvas {
   creating_NewObject: boolean = false
   mousedownPoint = { x: 0, y: 0 };
   curr_fill: string;
   curr_stroke: string;
   brush_stroke_size = 3;
   brush_stroke_color: string;
   draw_brush: fabric.PencilBrush | fabric.SprayBrush | fabric.CircleBrush | null = null

   onNewObjewct: (obj: fabric.FabricObject) => void;
   newShape: fabric.Object | null = null;
   callback: (v: { mode: Mode; objs: fabric.FabricObject[] | [] }) => void;
   setActiveObj: (v: fabric.FabricObject[] | []) => void;
   canvas: fabric.Canvas;
   mode: Mode;
   isDragging = false;
   isObjectsLocked = false;
   selector: fabric.ActiveSelection | null = null;
   copiedObjects?: fabric.FabricObject = undefined;
   redo = new Redo();
   undo = new Undo();

   constructor({ canvas, mode, callback, setActiveObj, curr_fill, curr_stroke, brush_stroke_color, onNewObjewct }: canvasInterface) {
      this.canvas = canvas;
      this.mode = mode;
      this.callback = callback;
      this.setActiveObj = setActiveObj;
      this.curr_fill = curr_fill;
      this.curr_stroke = curr_stroke;
      this.brush_stroke_color = brush_stroke_color;

      this.onNewObjewct = onNewObjewct;

      this.init()
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

   setBrushStroke(new_color: string) {
      if (this.draw_brush == null) return;
      this.draw_brush.color = new_color
      this.brush_stroke_color = new_color;
   }
   setBrushWidth(new_width: number) {
      if (this.draw_brush == null) return;
      this.draw_brush.width = new_width;
      this.brush_stroke_size = new_width;
   }
   setBrushType(brush_type: BrushType) {
      if (this.draw_brush == null) return;

      // Set the brush type to the new type
      if (brush_type === "spray") {
         this.draw_brush = new fabric.SprayBrush(this.canvas);
      } else if (brush_type === "pencil") {
         this.draw_brush = new fabric.PencilBrush(this.canvas);
      } else if (brush_type === "circle") {
         this.draw_brush = new fabric.CircleBrush(this.canvas);
      }

      this.draw_brush.color = this.brush_stroke_color;
      this.draw_brush.width = this.brush_stroke_size;

      this.canvas.freeDrawingBrush = this.draw_brush;
   }

   setDrawBrush() {
      this.canvas.isDrawingMode = true;

      if (this.draw_brush == null) {
         this.draw_brush = new fabric.PencilBrush(this.canvas);
      }
      this.draw_brush.width = this.brush_stroke_size;
      this.draw_brush.color = this.brush_stroke_color;

      this.canvas.freeDrawingBrush = this.draw_brush;
   }

   mousedown(e: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
      const { x, y } = e.scenePoint;

      this.mousedownPoint = { x, y };

      if (this.mode === "free") {
         this.isDragging = true;
         this.isObjectsLocked = true;
         this.canvas.selection = false;
         this.canvas.getObjects().forEach((obj) => {
            obj.set({ selectable: false }); // Disable object selection
         });

         this.callback({ mode: "free", objs: [] });
         return;
      }

      this.isObjectsLocked = false;

      if (!this.canvas.selection) {
         this.canvas.selection = true;
      }

      if (this.mode !== "default" && this.mode !== "draw") {
         this.canvas.discardActiveObject();
         this.canvas.set("selection", false)
         switch (this.mode) {
            case "rect":
               this.newShape = new DefaultRect({
                  top: y,
                  left: x,
                  width: 0,
                  height: 0,
                  strokeDashOffset: 2,
                  fill: this.curr_fill,
                  stroke: this.curr_stroke,
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
               this.newShape = new DraggableLine([x, y, x, y], {});
               break;
            case "text":
               let text = new DefaultText("", {
                  top: y,
                  left: x,
                  fill: this.curr_fill,
                  stroke: this.curr_stroke,
                  fontFamily: "Arial",
               });
               text.enterEditing();
               this.newShape = text;
               break;
            case "triangle":
               this.newShape = new DefaultTriangle({
                  top: x,
                  left: y,
                  width: 0,
                  height: 0,
                  strokeWidth: 3,
                  stroke: "white",
                  fill: "transparent",
               });
               break;
         }
         this.creating_NewObject = true
         if (this.newShape) this.add(this.newShape);

         // insert to undo store
         if (this.newShape) {
            this.undo.insertObj({ inType: "fresh", objs: [this.newShape] });
            return;
         }
      }

      const objs = this.canvas.getActiveObject();
      if (objs) {
         if (objs instanceof fabric.ActiveSelection) {
            const objstojson: fabric.FabricObject[] = []
            objs.forEachObject((o) => {
               const brect = o.getBoundingRect();
               objstojson.push({ ...o.toJSON(), left: brect.left, top: brect.top })
            })
            this.undo.insertObj({
               inType: "default",
               objs: objstojson,
            })
         } else {
            this.undo.insertObj({
               inType: "default",
               // @ts-expect-error id custom prop
               objs: [{ ...objs.toJSON(), id: objs?.id }],
            });
         }
      }
      this._setActive();
      // this.canvas.requestRenderAll();
   }

   mouseMove(e: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
      const { x, y } = e.scenePoint;
      if (this.isDragging) {
         const vpt = this.canvas.viewportTransform;
         vpt[4] += x - this.mousedownPoint.x;
         vpt[5] += y - this.mousedownPoint.y;
         this.canvas.requestRenderAll();
      }

      if (this.newShape) {
         // const { x, y } = e.viewportPoint;
         if (this.mode === canvasMode.Rect || this.mode === canvasMode.Triangle) {
            this.newShape.set({
               left: x > this.mousedownPoint.x ? this.mousedownPoint.x : x,
               top: y > this.mousedownPoint.y ? this.mousedownPoint.y : y,
               width:
                  x > this.mousedownPoint.x
                     ? x - this.mousedownPoint.x
                     : this.mousedownPoint.x - x,
               height:
                  y > this.mousedownPoint.y
                     ? y - this.mousedownPoint.y
                     : this.mousedownPoint.y - y,
            });
         } else if (this.mode === canvasMode.Ellipse) {
            this.newShape.set({
               rx: Math.abs(x - this.mousedownPoint.x),
               ry: Math.abs(y - this.mousedownPoint.y),
            });
         } else if (this.mode === canvasMode.Line) {
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
   }

   mouseUp(e: fabric.TPointerEventInfo<fabric.TPointerEvent>) {
      this.isDragging = false;

      if (this.mode === "free") {
         return;
      }

      if (!this.isObjectsLocked) {
         this.unlockObjects();
      }

      if (this.mode === "draw") return;
      this.canvas.selection = true;
      if (this.newShape) {
         this.canvas.set("selection", true);
         // Select the newly created shape

         this.canvas.setActiveObject(this.newShape);
         this.canvas.renderAll();
         this.mode = "default";
         this.creating_NewObject = false
         this.canvas.fire("object:added", {
            target: this.newShape,
         })
      }

      this.newShape = null;
      this.callback({ mode: "default", objs: this.canvas.getObjects() });
      this._setActive();
   }

   unlockObjects() {
      /* unlock objects */
      this.canvas.getObjects().forEach((obj) => {
         obj.set({ selectable: true }); // Disable object selection
      });
   }

   windowResize() {
      this.canvas.setDimensions({
         width: window.innerWidth,
         height: window.innerHeight,
      });
      this.canvas.requestRenderAll();
   }

   scroll() {
      this.canvas.on("mouse:wheel", (e) => {
         const delta = e.e.deltaY; // Get the wheel delta (positive for scroll down, negative for scroll up)

         if (e.e.ctrlKey) {
            let zoom = this.canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            this.canvas.setZoom(zoom);
         } else {
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
         }
         e.e.preventDefault();
         e.e.stopPropagation();
      });
   }

   deleteObject() {
      const canvas = this.canvas;
      const objs = canvas.getActiveObjects();
      const objsJson: fabric.FabricObject[] = [];

      if (!objs || objs.length === 0) return;

      objs.forEach((obj) => {
         const box = obj.getBoundingRect();
         objsJson.push({
            ...obj.toJSON(), id: obj.get("id"), left: box.left, top: box.top,
         })
         canvas.remove(obj);
      });

      if (objsJson.length) {
         this.undo.insertObj({ inType: "delete", objs: objsJson })
      }

      canvas.discardActiveObject();
      canvas.requestRenderAll();
      this.callback({ mode: this.mode, objs: [] });
   }

   async copyObjects() {
      const ac = this.canvas.getActiveObject();
      const clone = await ac?.clone();
      return clone;
   }

   async pasteObjects(copies?: fabric.FabricObject) {
      if (!copies) return;
      const clonedObjs = await copies.clone();
      const copyObjs: fabric.FabricObject[] = []

      this.canvas.discardActiveObject();

      clonedObjs.set({
         left: clonedObjs.left + 10,
         top: clonedObjs.top + 10,
      });
      if (clonedObjs instanceof fabric.ActiveSelection) {
         clonedObjs.canvas = this.canvas;
         clonedObjs.forEachObject((o) => {
            this.canvas.add(o);
            copyObjs.push(o.toJSON())
         });
         clonedObjs.setCoords();
      } else {
         copyObjs.push(clonedObjs)
         this.canvas.add(clonedObjs);
      }


      this.undo.insertObj({ inType: "fresh", objs: copyObjs })
      this.canvas.setActiveObject(clonedObjs);
      this.canvas.requestRenderAll();
   }

   async duplicateShape() {
      const objs = await this.copyObjects();
      this.pasteObjects(objs);
   }

   undoObjects() {
      const val = this.undo._pushOut();
      const objs: fabric.FabricObject[] = [];

      switch (val?.inType) {
         case "fresh":
            val.objs.forEach((o) => {
               objs.push(o);
               this.canvas.remove(o);
            });
            break;
         case "default":
            this.canvas.discardActiveObject();
            val.objs.forEach((v) => {
               // Find a fabric object by a custom property (e.g., `id`)
               const foundObject = this.canvas.getObjects().find((obj) => {
                  // @ts-expect-error id a custom property
                  return obj.get("id") == v?.id;
               });
               if (foundObject) {
                  objs.push({
                     ...foundObject.toJSON(),
                     id: foundObject.get("id"),
                  });

                  foundObject.set({ ...v });
                  foundObject.setCoords();
               }
            });
            break;
         case "delete":
            this.canvas.discardActiveObject();
            val.objs.forEach((o) => {
               let s: fabric.FabricObject | null = null;
               this.canvas.discardActiveObject();

               switch (o.type) {
                  case "Rect":
                     s = new DefaultRect({ ...o });
                     break;
                  case "Circle":
                     s = new DefaultCircle({ ...o })
                     break;
                  case "Ellipse":
                     s = new DefaultEllipse({ ...o })
                     break;
                  case "IText":
                     s = new DefaultText("", { ...o })
               }
               if (s) {
                  // @ts-expect-error id a custom property
                  s.set({ id: o?.id });
                  objs.push(s);
                  this.canvas.add(s);
               }
            });
            break;
      }

      if (objs.length && val?.inType) {
         this.redo.insertObj({ inType: val?.inType, objs: objs });

         this.canvas.requestRenderAll();
         this.callback({ mode: this.mode, objs: [] });
      }
   }

   redoObjects() {
      const val = this.redo._pushOut();
      const objs: fabric.FabricObject[] = [];

      this.canvas.discardActiveObject();

      switch (val?.inType) {
         case "default":
            this.canvas.discardActiveObject();
            val.objs.forEach((v) => {
               // Find a fabric object by a custom property (e.g., `id`)
               const foundObject = this.canvas.getObjects().find((obj) => {

                  // @ts-expect-error custom property
                  return obj.get("id") == v?.id;

               });
               if (foundObject) {
                  objs.push({
                     ...foundObject.toJSON(),
                     id: foundObject.get("id"),
                  });

                  foundObject.set({ ...v });
                  this.canvas.setActiveObject(foundObject);
               }
            });
            break;
         case "fresh":
            val.objs.forEach((o) => {
               let s: fabric.FabricObject | null = null;
               switch (o.type) {
                  case canvasMode.Rect:
                     s = new DefaultRect({ ...o });
                     break;
                  case canvasMode.Circle:
                     s = new DefaultCircle({ ...o })
                     break;
                  case canvasMode.Ellipse:
                     s = new DefaultEllipse({ ...o })
                     break;
                  case canvasMode.Text:
                     if (o instanceof fabric.FabricText) {
                        s = new DefaultText(o.text, { ...o })
                     }
               }
               if (s) {
                  objs.push(s);
                  this.canvas.add(s);
               }
            });
            // this.canvas.setActiveObject(s);
            break;
         case "delete":
            val.objs.forEach((o) => {
               objs.push(o.toJSON());
               this.canvas.remove(o);
            });
      }

      if (objs.length && val?.inType) {
         this.undo.insertObj({ inType: val.inType, objs });
         this.canvas.requestRenderAll();
         this.callback({ mode: this.mode, objs: [] });
      }
   }

   async documentKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey) {
         if (e.key === "d") {
            e.preventDefault();
            this.duplicateShape();
         } else if (e.key === "a") {
            e.preventDefault();

            const s = new fabric.ActiveSelection(this.canvas.getObjects(), {
               canvas: this.canvas,
               cornerColor: "#5090af",
               cornerStyle: "circle",
               cornerSize: 10,
               padding: 3,
               transparentCorners: false,
               borderDashArray: [3]
            });

            this.canvas.setActiveObject(s);
            this.canvas.requestRenderAll();
            this.callback({ mode: this.mode, objs: [s] });
         } else if (e.key === "c") {
            this.copiedObjects = await this.copyObjects();
         } else if (e.key === "v") {
            this.pasteObjects(this.copiedObjects);
         } else if (e.key === "z") {
            e.preventDefault();
            this.undoObjects();
         } else if (e.key === "y") {
            this.redoObjects();
         }
      } else if (e.key === "Delete") {
         this.deleteObject();
      }
   }

   dblClick() { }

   init() {
      this.scroll();

      this.canvas.on("selection:created", () => {
         const selected = this.canvas.getActiveObject()
         if (selected?.type === "activeselection") {
            selected.set({
               ...defaultActiveSelectionStyle
            })
         }
      })
      this.canvas.on("object:added", (e) => {
         // callback for new object
         if (this.creating_NewObject) return
         this.onNewObjewct(
            { ...e.target?.toJSON(), id: e.target.get("id") }
         )

         if (e.target.type === "path") {
            e.target.set({
               cornerColor: "transparent",
               cornerStrokeColor: "#5090ff",
               cornerSize: 10,
               padding: 2,
               transparentCorners: false,
               strokeUniform: true,
            });
         }
      })
      this.canvas.on("mouse:down", this.mousedown.bind(this))
      this.canvas.on("mouse:move", this.mouseMove.bind(this))
      this.canvas.on("mouse:up", this.mouseUp.bind(this))
      window.addEventListener("resize", this.windowResize.bind(this));
      document.addEventListener("keydown", this.documentKeyDown.bind(this));
   }

   clear() {
      this.canvas.removeListeners();
      this.canvas.dispose();
      window.removeEventListener("resize", this.windowResize);
      document.removeEventListener("keydown", this.documentKeyDown.bind(this));
   }
}

export default Canvas;
