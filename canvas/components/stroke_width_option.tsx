import OptionLayout from "./option_layout";
import { useEffect, useState } from "react";
import { useActiveObject } from "canvas/store/active_obj";
import { widths } from "canvas/config";
import { cn } from "~/lib/utils";

type props = {
  handleStrokeWidth: (w: number) => void;
};

const StrokeWidthOption = ({ handleStrokeWidth }: props) => {
  const { obj } = useActiveObject();
  const [width, setWidth] = useState(
    obj.length === 1 ? obj[0].get("strokeWidth") : null
  );
  useEffect(() => {
    setWidth(obj.length === 1 ? obj[0].get("strokeWidth") : null);
  }, [obj]);

  return (
    <OptionLayout label="Stroke Width">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 justify-center items-center">
          {widths.map((w, i) => (
            <button
              onClick={() => {
                handleStrokeWidth(w);
                setWidth(w);
              }}
              key={i}
              style={{ width: "2em", height: "2em" }}
              className={cn(
                width == w ? "bg-foreground/20" : " bg-foreground/5",
                "rounded-sm flex justify-center items-center"
              )}
            >
              <span
                className="bg-foreground"
                style={{ width: "80%", height: `${w}px` }}
              />
            </button>
          ))}

          <input
            onChange={(e) => {
              const v = parseInt(e.target.value);
              if (v == 1) return;
              setWidth(v);
              handleStrokeWidth(v);
            }}
            value={width}
            className="w-[50px]"
            type="number"
            defaultValue={width}
          />
        </div>
      </div>
    </OptionLayout>
  );
};

export default StrokeWidthOption;
