import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { DefaultRect } from "./defaultprop";
import Canvas from "./canvas";
import ChangeMode from "./components/changemode";
import { useMode } from "./store/mode";
import { useActiveObject } from "./store/active_obj";
import ObjectControls from "./components/obj_controls";
import CanvasMenu from "./components/canvas_menu";
import { useCanvasStore } from "./store/canvas_config_store";
import { useTheme } from "remix-themes";

const Canvasdraw = () => {
  const { mode, setMode } = useMode();
  const [theme] = useTheme();

  const { setActiveObj, obj } = useActiveObject();
  const { backgroundColor, handleBackgroundColor } = useCanvasStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    // const b = document.body.getAttribute("data-theme")
    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "white",
    });

    c.add(new DefaultRect({}));
    c.renderAll();

    fabricRef.current = new Canvas({
      mode,
      canvas: c,
      callback: () => {
        setMode("default");
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

  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.mode = mode;
  }, [mode]);

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
        <ChangeMode fabricRef={fabricRef} />
      </div>
      <div className="fixed left-2 top-[10%] hidden md:block z-[999999]">
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
