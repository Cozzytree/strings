import Canvas from "canvas/canvas";
import { useActiveObject } from "canvas/store/active_obj";
import StrokeOption from "./stroke_option";
import BackgroundOption from "./background_option";
import StrokeStyleOption from "./strokeStyle_option";
import StrokeWidthOption from "./stroke_width_option";
import OpacityOption from "./opacity_option";
import GroupOption from "./group_option";
import { ActiveSelection, Group } from "fabric";

type props = {
  fabricRef: React.MutableRefObject<Canvas | null>;
};

const ObjectControls = ({ fabricRef }: props) => {
  const { obj } = useActiveObject();
  const handleStroke = (v: string) => {
    if (!fabricRef.current || !obj) return;
    for (let i = 0; i < obj.length; i++) {
      const o = obj[i];
      o.set({ stroke: v });
      o.setCoords(); // Update coordinates

      // Mark the object as dirty (only re-render this object)
      o.dirty = true;

      // Force re-render only this object
    }
    fabricRef.current.canvas.renderAll();
  };

  const handleColor = (c: string) => {
    if (!fabricRef.current || !obj) return;
    for (let i = 0; i < obj.length; i++) {
      const o = obj[i];
      o.set({ fill: c });
      o.setCoords(); // Update coordinates

      // Mark the object as dirty (only re-render this object)
      o.dirty = true;

      // Force re-render only this object
    }
    fabricRef.current.canvas.renderAll();
  };

  const handleStrokeStyle = (v: [number, number]) => {
    if (!fabricRef.current || !obj) return;
    for (let i = 0; i < obj.length; i++) {
      const o = obj[i];
      o.set({ strokeDashArray: v });
      o.setCoords(); // Update coordinates

      // Mark the object as dirty (only re-render this object)
      o.dirty = true;

      // Force re-render only this object
    }
    fabricRef.current.canvas.renderAll();
  };

  const handleStrokeWidth = (w: number) => {
    if (!fabricRef.current || !obj) return;
    for (let i = 0; i < obj.length; i++) {
      const o = obj[i];
      o.set({ strokeWidth: w });
      o.setCoords(); // Update coordinates

      // Mark the object as dirty (only re-render this object)
      o.dirty = true;

      // Force re-render only this object
    }
    fabricRef.current.canvas.renderAll();
  };

  const handleOpacity = (v: number) => {
    if (!fabricRef.current || !obj) return;
    for (let i = 0; i < obj.length; i++) {
      const o = obj[i];
      o.set({ opacity: v });
      o.setCoords(); // Update coordinates

      // Mark the object as dirty (only re-render this object)
      o.dirty = true;

      // Force re-render only this object
    }
    fabricRef.current.canvas.renderAll();
  };

  const handleGroup = (type: "group" | "ungroup") => {
    const fabric = fabricRef.current;
    if (!fabric) return;
    const activeObject = fabric.canvas.getActiveObject();

    if (type === "group") {
      if (fabric.canvas.getActiveObject()?.type !== "activeselection") {
        return;
      }
      // @ts-expect-error i am not sure if there is a new method to remove the selected currently getting a warning of not in type
      const group = new Group(activeObject?.removeAll(), {
        cornerColor: "",
        cornerStrokeColor: "#2080ff",
        cornerDashArray: [2, 2],
      });
      fabric.canvas.add(group);
      fabric.canvas.setActiveObject(group);
      fabric.canvas.requestRenderAll();
    } else if (type === "ungroup") {
      if (activeObject?.type !== "group") return;
      fabric.canvas.remove(activeObject);

      // @ts-ignore removeAll not in tyep
      const selected = new ActiveSelection(activeObject?.removeAll(), {
        canvas: fabric.canvas,
      });
      fabric.canvas.setActiveObject(selected);
      fabric.canvas.requestRenderAll();
    }
  };

  return (
    <div className="h-[700px] w-[14em] rounded-lg bg-secondary border">
      <StrokeOption handleStroke={handleStroke} />
      <div className="w-ful border border-foreground/10 my-2" />

      <BackgroundOption handleColor={handleColor} />
      <div className="w-ful border border-foreground/10 my-2" />

      <StrokeStyleOption handleStrokeStyle={handleStrokeStyle} />
      <div className="w-ful border border-foreground/10 my-2" />

      <StrokeWidthOption handleStrokeWidth={handleStrokeWidth} />
      <div className="w-ful border border-foreground/10 my-2" />

      <OpacityOption handleOpacity={handleOpacity} />

      <GroupOption
        handleGroup={handleGroup}
        isGrouped={() => {
          if (!fabricRef.current) return false;
          if (fabricRef.current.canvas.getActiveObject()?.type === "group") {
            return true;
          }

          return false;
        }}
      />
    </div>
  );
};

export default ObjectControls;
