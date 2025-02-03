import ObjectControls from "./components/obj_controls";
import CanvasMenu from "./components/canvas_menu";
import Canvas from "./canvas";
import ChangeMode from "./components/changemode";
// import "./store/localdb"

// import { lazy } from "react";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import { useMode } from "./store/mode";
import { useActiveObject } from "./store/active_obj";
import { useCanvasStore } from "./store/canvas_config_store";
import { Mode } from "./types";
import { DefaultPolygon } from "./defaultprop";

const Canvasdraw = () => {
  const { mode, setMode } = useMode();

  const { setActiveObj, obj } = useActiveObject();
  const { backgroundColor } = useCanvasStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  useEffect(() => {
    // const b = document.body.getAttribute("data-theme")
    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: localStorage.getItem("canvas-bg") || backgroundColor,
      preserveObjectStacking: true,
    });

    // c.add(new fabric.Polyline([
    //   { x: 10, y: 10 },
    //   { x: 50, y: 30 },
    //   { x: 40, y: 70 },
    //   { x: 60, y: 50 },
    //   { x: 100, y: 150 },
    //   { x: 40, y: 100 },
    //   { x: 10, y: 10 },
    // ], {
    //   stroke: 'red',
    //   left: 100,
    //   top: 100,
    // }))
    c.add(new DefaultPolygon(
      [
        { x: 100, y: 50 },   // top point
        { x: 140, y: 85 },   // right-upper point
        { x: 120, y: 130 },  // right-lower point
        { x: 80, y: 130 },   // left-lower point
        { x: 60, y: 85 },    // left-upper point
        { x: 100, y: 50 },   // top point
      ], {
      stroke: "white",
      strokeWidth: 3,
      fill: "#202020",
      centeredScaling: true
    }))
    c.add(
      new fabric.Polygon(
        [
          { x: 200, y: 10 },
          { x: 250, y: 50 },
          { x: 250, y: 180 },
          { x: 150, y: 180 },
          { x: 150, y: 50 },
        ],
        {
          strokeLineJoin: "round",
          fill: "green",
          stroke: "white",
          strokeWidth: 20,
        }
      )
    );
    c.renderAll();

    fabricRef.current = new Canvas({
      mode,
      canvas: c,
      callback: ({ mode, objs }) => {
        setMode(mode);
        setActiveObj(objs);
      },
      setActiveObj(v) {
        setActiveObj(v);
      },
    });
    fabricRef.current.init();

    return () => {
      if (fabricRef.current) {
        fabricRef.current.clear();
      }
    };
  }, []);

  const handleChangeMode = (m: Mode) => {
    if (!fabricRef.current) return;
    fabricRef.current.mode = m;
  };

  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.canvas.backgroundColor = backgroundColor;
    fabricRef.current.canvas.requestRenderAll();
  }, [backgroundColor]);

  return (
    <>
      <div className="fixed top-5 left-2 z-[99999]">
        <CanvasMenu />
      </div>

      <div className="fixed top-5 left-1/2 translate-x-[-50%] w-fit flex justify-center pointer-events-auto z-[999999]">
        <ChangeMode handleMode={handleChangeMode} fabricRef={fabricRef} />
      </div>
      <div className="fixed left-2 top-[8%] hidden md:block z-[999999]">
        {obj.length > 0 && (
          <>
            <ObjectControls fabricRef={fabricRef} />
          </>
        )}
      </div>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default Canvasdraw;
