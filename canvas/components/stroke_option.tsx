import { useActiveObject } from "canvas/store/active_obj";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn } from "~/lib/utils";
import ColorOptions from "./color_options";

const colors = ["#101010", "#ef4040", "#20ff50", "#2050ef", "#9a9a10"];

type props = {
  handleStroke: (v: string) => void;
};

const StrokeOption = ({ handleStroke }: props) => {
  const { obj } = useActiveObject();
  const stroke = obj.length === 1 ? obj[0].get("stroke") : "";

  return (
    <div className="flex flex-col gap-2 px-2">
      <h6 className="font-bold text-sm">Stroke</h6>
      <div className="flex justify-between">
        <div className="flex gap-1">
          {colors.map((c) => (
            <button
              onClick={() => {
                handleStroke(c);
              }}
              className={cn(stroke !== c && "outline-1", "rounded-sm")}
              key={c}
              style={{ background: c, width: "1.6em", height: "1.6em" }}
            />
          ))}
        </div>
        <ColorOptions
          fn={(v) => {
            handleStroke(v);
          }}
          color={stroke}
        />
      </div>
    </div>
  );
};

export default StrokeOption;
