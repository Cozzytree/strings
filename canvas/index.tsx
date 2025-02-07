import ObjectControls from "./components/obj_controls";
import CanvasMenu from "./components/canvas_menu";
import Canvas from "./canvas";
import ChangeMode from "./components/changemode";

// import { lazy } from "react";
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import { useMode } from "./store/mode";
import { useActiveObject } from "./store/active_obj";
import { useCanvasStore } from "./store/canvas_config_store";
import { Mode } from "./types";
import { Theme, useTheme } from "remix-themes";
import DrawOptions from "./components/draw_options";
import IndexDB from "./store/index_db";
import { FabricObject } from "node_modules/fabric/dist/src/shapes/Object/Object";
import { usePage } from "./store/page_store";

const dbname = "string-db";
const dbVersion = 5;


const Canvasdraw = () => {
  const { mode, setMode } = useMode();
  const { curr_active_page } = usePage()

  const [theme] = useTheme();
  const dbRef = useRef<IndexDB | null>(null)

  const { setActiveObj, obj } = useActiveObject();
  const { backgroundColor } = useCanvasStore();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<Canvas | null>(null);
  useEffect(() => {
    // const b = document.body.getAttribute("data-theme")

    // if (theme === Theme.DARK) {
    //   localStorage.setItem("canvas-bg", "#202020")
    // } else {
    //   localStorage.setItem("canvas-bg", "#efefef")
    // }

    if (!canvasRef.current) return;
    const c = new fabric.Canvas(canvasRef.current, {
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: localStorage.getItem("canvas-bg") || backgroundColor,
      preserveObjectStacking: true,
      selectionColor: "#20202020",
      selectionBorderColor: theme === "dark" ? "#ffffff80" : "#202020",
      selectionLineWidth: 2,
      selectionDashArray: [3]
    });

    c.contextTop.globalCompositeOperation = "source-over"

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
    // c.add(
    //   new DefaultPolygon(
    //     [
    //       { x: 100, y: 50 }, // top point
    //       { x: 140, y: 85 }, // right-upper point
    //       { x: 120, y: 130 }, // right-lower point
    //       { x: 80, y: 130 }, // left-lower point
    //       { x: 60, y: 85 }, // left-upper point
    //       { x: 100, y: 50 }, // top point
    //     ],
    //     {
    //       stroke: "white",
    //       strokeWidth: 3,
    //       fill: "#202020",
    //       centeredScaling: true,
    //     }
    //   )
    // );
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
      curr_fill: "transparent",
      curr_stroke: theme === Theme.DARK ? "#ffffff" : "#000000",
      brush_stroke_color: theme === Theme.DARK ? "#ffffff" : "#000000",
      setActiveObj(v) {
        setActiveObj(v);
      },
      callback: ({ mode, objs }) => {
        setMode(mode);
        setActiveObj(objs);
      },

      onNewObjewct: (obj) => {
        if (!dbRef.current) return
        // dbRef.current.newShape(curr_active_page, obj)
      }
    });

    return () => {
      if (fabricRef.current) {
        fabricRef.current.clear();
      }
    };
  }, [theme]);

  useEffect(() => {
    if (!fabricRef.current) return;
    fabricRef.current.canvas.backgroundColor = backgroundColor;
    fabricRef.current.canvas.requestRenderAll();
  }, [backgroundColor]);

  useEffect(() => {
    const req = indexedDB.open(dbname, dbVersion)
    req.onsuccess = (e) => {
      const db = (e.target as IDBRequest).result as IDBDatabase;
      dbRef.current = new IndexDB({ db })

      // dbRef.current.newPage("page:hello Seattle", "page 2")
      // dbRef.current.getAllPages();
    };
    req.onupgradeneeded = (e) => {
      const dbInstance = (e.target as IDBRequest).result;
      console.log('Upgrade needed event triggered!', dbInstance);

      // Check if the object store exists, create it if not
      if (!dbInstance.objectStoreNames.contains('records')) {
        dbInstance.createObjectStore('records', { keyPath: 'id' });
        console.log('Object store "records" created');
      }
    }
  }, []);

  const handleChangeMode = (m: Mode) => {
    if (!fabricRef.current) return;
    fabricRef.current.mode = m;
  };

  const handleToImage = () => {
    if (!fabricRef.current) return;

    // Create an image element
    const i = new Image();

    // Get the data URL of the canvas
    const dataUrl = fabricRef.current.canvas.toDataURL();

    // Set the image source to the data URL
    i.src = dataUrl;

    // Create an anchor element to facilitate downloading
    const li = document.createElement("a");

    // Set the download attribute with a filename (you can set any name here)
    li.download = "fabric_canvas_image.png"; // Specify the file name

    // Set the href attribute to the data URL
    li.href = dataUrl;

    // Programmatically click the download link
    li.click();
  }

  const handleToJson = () => {
    if (!fabricRef.current) return;

    // Get the canvas JSON object
    const jsonFile = fabricRef.current.canvas.toJSON();

    // Convert the JSON object to a string
    const jsonString = JSON.stringify(jsonFile);

    // Create a Blob with the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create an anchor tag for downloading
    const link = document.createElement("a");
    link.download = "canvas.json";  // Set the desired file name for download

    // Create an object URL for the Blob
    link.href = URL.createObjectURL(blob);

    // Programmatically trigger the download
    link.click();
  }

  const handleImportfromFile = (json: string) => {
    if (!fabricRef.current) return
    fabricRef.current.canvas.loadFromJSON(json)
    fabricRef.current.canvas.renderAll()
  }

  return (
    <>
      <div className="fixed top-5 left-2 z-[99999]">
        <CanvasMenu
          handleImportfromFile={handleImportfromFile}
          handleToJson={handleToJson}
          handleToImage={handleToImage}
        />
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
        {mode === "draw" && <DrawOptions fabricRef={fabricRef} />}
      </div>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default Canvasdraw;
