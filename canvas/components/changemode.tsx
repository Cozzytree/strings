import Canvas from "canvas/canvas";
import { useMode } from "canvas/store/mode";
import { Mode } from "canvas/types";
import {
  ArrowUpRight,
  Circle,
  Hand,
  LucideIcon,
  MousePointer2Icon,
  PencilIcon,
  Square,
  TypeOutlineIcon,
} from "lucide-react";

const modes: { label: Mode; I: LucideIcon }[] = [
  { label: "free", I: Hand },
  { label: "default", I: MousePointer2Icon },
  { label: "rect", I: Square },
  { label: "ellipse", I: Circle },
  { label: "draw", I: PencilIcon },
  { label: "text", I: TypeOutlineIcon },
  { label: "line", I: ArrowUpRight },
];

type props = {
  fabricRef: React.MutableRefObject<Canvas | null>;
};

const ChangeMode = ({ fabricRef }: props) => {
  const { mode, setMode } = useMode();
  return (
    <div className="border-secondary border flex items-center rounded-sm">
      {modes.map((m, i) => (
        <button
          onClick={() => {
            if (fabricRef.current) {
              if (m.label === "draw") {
                fabricRef.current.setDrawBrush();
              } else {
                fabricRef.current.canvas.isDrawingMode = false
              }
            }
            setMode(m.label);
          }}
          className={`${
            m.label === mode
              ? "bg-foreground text-background rounded-md"
              : "hover:bg-accent"
          } transition-colors duration-200 px-[0.4em]`}
          key={i}
        >
          <m.I className="w-4 cursor-pointer" />
        </button>
      ))}
    </div>
  );
};

export default ChangeMode;
