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
import { Button } from "~/components/ui/button";

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
  handleMode: (m: Mode) => void;
  fabricRef: React.MutableRefObject<Canvas | null>;
};

const ChangeMode = ({ fabricRef, handleMode }: props) => {
  const { mode, setMode } = useMode();
  return (
    <div className="bg-secondary border-foreground/10 border flex items-center rounded-sm">
      {modes.map((m, i) => (
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            handleMode(m.label);
            if (fabricRef.current) {
              if (m.label === "draw") {
                fabricRef.current.setDrawBrush();
              } else {
                fabricRef.current.canvas.isDrawingMode = false;
              }

              if (fabricRef.current.isObjectsLocked) {
                fabricRef.current.isObjectsLocked = false;
                fabricRef.current.unlockObjects();
              }
            }
            setMode(m.label);
          }}
          className={`${
            m.label === mode
              ? "bg-foreground text-background rounded-md"
              : "hover:bg-accent bg-foreground/5"
          } transition-colors duration-200 px-[0.4em]`}
          key={i}
        >
          <m.I className="w-4 cursor-pointer" />
        </Button>
      ))}
    </div>
  );
};

export default ChangeMode;
