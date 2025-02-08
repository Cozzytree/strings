import { strokeStyles } from "canvas/config";
import OptionLayout from "./option_layout";
import { Ellipsis, Minus } from "lucide-react";
import { cn } from "~/lib/utils";
import { useActiveObject } from "canvas/store/active_obj";
import { useState } from "react";

type props = {
   handleStrokeStyle: (v: [number, number]) => void;
};

const dots = [
   () => <Minus />,
   () => <Ellipsis />,
   () => {
      return (
         <div className="w-full h-full flex justify-center items-center gap-[2px]">
            {Array.from({ length: 4 }).map((v, i) => (
               <span key={i} className="w-[3px] h-1 bg-foreground/70" />
            ))}
         </div>
      );
   },
];

const StrokeStyleOption = ({ handleStrokeStyle }: props) => {
   const { obj } = useActiveObject();
   const [activedots, setActivedots] = useState(
      obj.length === 1 ? obj[0].get("strokeDashArray") : [2, 2]
   );

   return (
      <OptionLayout label="Stroke Style">
         <div className="flex gap-2">
            {dots.map((d, i) => {
               return (
                  <button
                     style={{ width: "1.4em", height: "1.4em" }}
                     className={cn(
                        JSON.stringify(strokeStyles[i]) === JSON.stringify(activedots)
                           ? "bg-foreground/20"
                           : "bg-foreground/5",
                        "rounded-sm flex justify-center items-center"
                     )}
                     key={i}
                     onClick={() => {
                        const d = strokeStyles[i];
                        handleStrokeStyle(d);
                        setActivedots(d);
                     }}
                  >
                     {d()}
                  </button>
               );
            })}
         </div>
      </OptionLayout>
   );
};

export default StrokeStyleOption;
