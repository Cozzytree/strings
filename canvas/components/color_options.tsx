import { colors } from "canvas/config";
import { alphas, useActiveObject } from "canvas/store/active_obj";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

type props = {
  color: string;

  fn: (v: string) => void;
};

const ColorOptions = ({ color, fn }: props) => {
  const { currentColorAlpha, setCurrentColorAlpha } = useActiveObject();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          style={{ background: color, width: "1.6em", height: "1.6em" }}
          className="rounded-sm border border-foreground/30"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        sideOffset={20}
        className="space-y-2 bg-background p-2"
      >
        <div className="">
          <h6 className="text-sm font-bold">colors</h6>
          <div className="grid grid-cols-5 gap-2">
            {colors.map((c) => (
              <button
                onClick={() =>
                  fn(
                    currentColorAlpha === "ff"
                      ? c + "ff"
                      : c + String(currentColorAlpha * 100)
                  )
                }
                style={{
                  background:
                    currentColorAlpha === "ff"
                      ? c + "ff"
                      : c + String(currentColorAlpha * 100),
                  width: "1.6em",
                  height: "1.6em",
                }}
                className="rounded-sm border border-foreground/20"
              />
            ))}
          </div>
        </div>

        <div>
          <h6 className="text-sm font-bold">Aplha</h6>
          <div className="w-full gap-2 grid grid-cols-4">
            {[0.1, 0.25, 0.5, 0.75, 1].map((v) => (
              <button
                onClick={() => {
                  setCurrentColorAlpha(v as alphas);
                }}
                className="w-full h-[2em] relative rounded-sm border border-foreground/20"
              >
                <span className="text-xs absolute bottom-0 left-[3%]">{v}</span>
              </button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColorOptions;
