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
               style={{ background: color, width: "1.4em", height: "1.4em" }}
               className="rounded-sm border border-foreground/30"
            />
         </DropdownMenuTrigger>
         <DropdownMenuContent
            side="right"
            sideOffset={20}
            className="space-y-2 p-4 bg-secondary"
         >
            <div className="">
               <h6 className="text-sm">colors</h6>
               <div className="grid grid-cols-5 gap-2">
                  {colors.map((c) => (
                     <button
                        key={c}
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
                        className={`${c === color?.slice(0, color.length - 2) && "ring-4 ring-foreground"} border border-foreground/20 rounded-sm`}
                     />
                  ))}
               </div>
            </div>

            <div>
               <h6 className="text-sm font-bold">Aplha</h6>
               <div className="w-full grid grid-cols-5 gap-1">
                  {[0.1, 0.25, 0.5, 0.75, 1].map((v) => (
                     <div className="relative w-full" key={v}>
                        <button
                           key={v}
                           style={{ background: color, opacity: v }}
                           onClick={() => {
                              setCurrentColorAlpha(v as alphas);
                           }}
                           className={`w-full h-[1.5em] relative rounded-sm border border-foreground/20`}
                        >
                        </button>
                        <span
                           className="pointer-events-none text-xs absolute bottom-0 left-[3%] mix-blend-difference">{v}</span>
                     </div>
                  ))}
               </div>
            </div>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default ColorOptions;
