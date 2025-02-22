import Canvas from "canvas/canvas";
import StrokeOption from "./stroke_option";
import BackgroundOption from "./background_option";
import StrokeStyleOption from "./strokeStyle_option";
import StrokeWidthOption from "./stroke_width_option";
import OpacityOption from "./opacity_option";
import GroupOption from "./group_option";
import LayerOption from "./layer_option";
import TextOption from "./text_option";
import ActionOption from "./action_option";

import { useActiveObject } from "canvas/store/active_obj";
import { ActiveSelection, FabricObject, Group } from "fabric";


type props = {
  fabricRef: React.MutableRefObject<Canvas | null>;
};

const ObjectControls = ({ fabricRef }: props) => {
  const { obj, setActiveObj } = useActiveObject();

  const handleStroke = (v: string) => {
    if (!fabricRef.current || !obj) return;

    if (obj.length === 1) {
      const o = obj[0];
      if (o instanceof ActiveSelection) {
        o.forEachObject((ob) => {
          ob.set({ stroke: v });
        });
        fabricRef.current.canvas.requestRenderAll();
        return;
      }
    }

    for (let i = 0; i < obj.length; i++) {
      const o = obj[i];
      if (o.type === "group") {
        // @ts-expect-error i am not sure about other methods to get object from gropu
        const objs: FabricObject[] = o?._objects;
        if (objs.length) {
          objs.forEach((ob: FabricObject) => {
            ob.set({ stroke: v });
            // ob.setCoords()
          });
        }
      } else {
        o.set({ stroke: v });
        o.setCoords(); // Update coordinates
        // o.setCoords()
        // Mark the object as dirty (only re-render this object)
      }

      // Force re-render only this object
    }
    fabricRef.current.canvas.requestRenderAll();
  };

  const handleColor = (c: string) => {
    if (!fabricRef.current || !obj) return;
    for (let i = 0; i < obj.length; i++) {
      const o = obj[i];

      if (o instanceof Group) {
        o.forEachObject((o) => {
          o.set({ fill: c });
        })
      }
      else {
        o.set({ fill: c });
        o.setCoords(); // Update coordinates
      }
    }
    // Force re-render only this object
    fabricRef.current.canvas.requestRenderAll();
  };

  const handleStrokeStyle = (v: [number, number]) => {
    if (!fabricRef.current || !obj) return;
    for (let i = 0; i < obj.length; i++) {
      const o = obj[i];
      o.set({ strokeDashArray: v });

      // Mark the object as dirty (only re-render this object)
      // o.dirty = true;

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
    }
    fabricRef.current.canvas.requestRenderAll();
  };

  const handleOpacity = (v: number) => {
    if (!fabricRef.current || !obj) return;
    for (let i = 0; i < obj.length; i++) {
      const o = obj[i];
      o.set({ opacity: v });
      o.setCoords(); // Update coordinates
    }
    fabricRef.current.canvas.requestRenderAll();
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
        cornerColor: "transparent",
        cornerStrokeColor: "#5090ff",
        cornerSize: 10,
        padding: 2,
        transparentCorners: false,
        strokeUniform: true,
        objectCaching: true,
      });
      fabric.canvas.add(group);
      fabric.canvas.setActiveObject(group);
      fabric.canvas.requestRenderAll();
    } else if (type === "ungroup") {
      if (activeObject?.type !== "group") return;
      fabric.canvas.remove(activeObject);

      if (activeObject instanceof Group) {
        activeObject?.forEachObject((o) => {
          fabricRef.current?.add(o)
          o.set({
            cornerColor: "transparent",
            cornerStrokeColor: "#5090ff",
            cornerSize: 10,
            padding: 2,
            transparentCorners: false,
            strokeUniform: true,
          })
        })
        const selected = new ActiveSelection(
          activeObject?.removeAll(), {
          canvas: fabric.canvas,
        });
        fabric.canvas.setActiveObject(selected);
      }
      fabric.canvas.requestRenderAll();
    }
  };

  const handleIndex = (where: "up" | "down" | "front" | "back") => {
    const fabric = fabricRef.current;
    if (!fabric) return;
    const active = fabric.canvas.getActiveObject();
    // || active?.type === "group"
    if (!active) return;

    if (where === "up") {
      fabric.canvas.bringObjectForward(active);
    } else if (where === "down") {
      fabric.canvas.sendObjectBackwards(active);
    } else if (where === "front") {
      fabric.canvas.bringObjectToFront(active);
    } else if (where === "back") {
      fabric.canvas.sendObjectToBack(active);
    }
    fabric.canvas.requestRenderAll();
  };

  const handleRemoveObj = () => {
    if (!fabricRef.current) return;

    fabricRef.current.deleteObject();
  };

  const handleFontFamily = (f: string) => {
    if (obj.length > 1 || !fabricRef.current) return;
    if (obj[0].type !== "i-text") return;

    obj[0].set({ fontFamily: f });
    obj[0].dirty = true;
    fabricRef.current.canvas.requestRenderAll();
  };

  const handleFontSize = (v: number) => {
    if (obj.length > 1 || !fabricRef.current) return;
    if (obj[0].type !== "i-text") return;

    obj[0].set({ fontSize: v });
    obj[0].dirty = true;
    fabricRef.current.canvas.requestRenderAll();
  };

  const handleTextAlign = (v: "left" | "center" | "right") => {
    if (obj.length > 1 || !fabricRef.current) return;
    if (obj[0].type !== "i-text") return;

    obj[0].set({ textAlign: v });
    obj[0].dirty = true;
    fabricRef.current.canvas.requestRenderAll();
  };

  const handleDuplicate = () => {
    if (!fabricRef.current) return;
    fabricRef.current.duplicateShape();
  };

  return (
    <div className="h-fit pt-4 pb-6 px-2 w-[14em] rounded-lg bg-secondary border">
      <StrokeOption handleStroke={handleStroke} />
      <div className="w-ful border border-foreground/10 my-2" />

      <BackgroundOption handleColor={handleColor} />
      <div className="w-ful border border-foreground/10 my-2" />

      {obj.length === 1 && obj[0].type === "i-text" && (
        <>
          <TextOption
            handleFontSize={handleFontSize}
            handleTextAlign={handleTextAlign}
            handleFontFamily={handleFontFamily}
          />
          <div className="w-ful border border-foreground/10 my-2" />
        </>
      )}

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
      <div className="w-ful border border-foreground/10 my-2" />

      <LayerOption handleIndex={handleIndex} />
      <div className="w-ful border border-foreground/10 my-2" />

      <ActionOption
        handleDuplicate={handleDuplicate}
        handleRemove={handleRemoveObj}
      />
    </div>
  );
};

export default ObjectControls;
