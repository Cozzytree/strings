import { useEffect, useRef } from "react";
import * as fabric from "fabric";
import { DefaultRect } from "./defaultprop";
import Canvas from "./canvas";
import ChangeMode from "./components/changemode";
import { useMode } from "./store/mode";
import { useActiveObject } from "./store/active_obj";
import ObjectControls from "./components/obj_controls";
import BackgroundOption from "./components/background_option";

const Canvasdraw = () => {
  const { mode, setMode } = useMode();
  const { setActiveObj, obj } = useActiveObject();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);

  useEffect(() => {
    // const b = document.body.getAttribute("data-theme")

    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
    });

    c.add(new DefaultRect({}));

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

  return (
    <>
      <div className="fixed top-5 w-full flex justify-center pointer-events-auto z-[999999]">
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
